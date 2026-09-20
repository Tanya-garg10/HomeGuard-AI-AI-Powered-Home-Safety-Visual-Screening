import { INITIAL_SAMPLE_SCANS } from '../data/sampleScans';
import { ScanResult } from '../types';
import {
  saveScanToFirestore,
  deleteScanFromFirestore,
  fetchScansFromFirestore,
  testFirestoreConnection,
} from './firebase';

const STORAGE_KEY = 'homeguard_scans_v1';

export const storageService = {
  getScans(): ScanResult[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        // Initialize with default sample scans for instant experience
        this.resetToDefaults();
        return INITIAL_SAMPLE_SCANS;
      }
      const parsed: ScanResult[] = JSON.parse(raw);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        this.resetToDefaults();
        return INITIAL_SAMPLE_SCANS;
      }
      return parsed;
    } catch {
      return INITIAL_SAMPLE_SCANS;
    }
  },

  getScanById(id: string): ScanResult | null {
    const scans = this.getScans();
    return scans.find((s) => s.id === id) || null;
  },

  saveScan(scan: ScanResult): void {
    try {
      const scans = this.getScans();
      const existingIdx = scans.findIndex((s) => s.id === scan.id);
      if (existingIdx >= 0) {
        scans[existingIdx] = scan;
      } else {
        scans.unshift(scan);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(scans));

      // Asynchronously sync to Firestore database
      saveScanToFirestore(scan).catch((err) => {
        console.warn('Firestore background sync note:', err?.message || err);
      });
    } catch (e) {
      console.error('Failed to save scan:', e);
    }
  },

  deleteScan(id: string): void {
    try {
      const scans = this.getScans().filter((s) => s.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(scans));

      // Asynchronously delete from Firestore database
      deleteScanFromFirestore(id).catch((err) => {
        console.warn('Firestore background delete note:', err?.message || err);
      });
    } catch (e) {
      console.error('Failed to delete scan:', e);
    }
  },

  toggleHazardFixed(scanId: string, hazardId: string): ScanResult | null {
    try {
      const scans = this.getScans();
      const scan = scans.find((s) => s.id === scanId);
      if (!scan) return null;

      const hazard = scan.hazards.find((h) => h.id === hazardId);
      if (!hazard) return null;

      hazard.fixed = !hazard.fixed;
      hazard.fixedAt = hazard.fixed ? new Date().toISOString() : undefined;

      // Recalculate score slightly when fixed
      const fixedCount = scan.hazards.filter((h) => h.fixed).length;
      const initialScore = scan.overallScore;
      const potentialGain = Math.min(100, initialScore + fixedCount * 6);
      scan.overallScore = Math.min(100, potentialGain);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(scans));

      // Sync updated scan to Firestore
      saveScanToFirestore(scan).catch((err) => {
        console.warn('Firestore update sync note:', err?.message || err);
      });

      return scan;
    } catch (e) {
      console.error('Failed to toggle hazard status:', e);
      return null;
    }
  },

  resetToDefaults(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_SCANS));
      // Sync initial sample records to Firestore
      INITIAL_SAMPLE_SCANS.forEach((sample) => {
        saveScanToFirestore(sample).catch(() => {});
      });
    } catch (e) {
      console.error('Failed to reset defaults:', e);
    }
  },

  async syncWithFirestore(): Promise<ScanResult[]> {
    try {
      await testFirestoreConnection();
      const remoteScans = await fetchScansFromFirestore();
      if (remoteScans && remoteScans.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(remoteScans));
        return remoteScans;
      } else if (remoteScans && remoteScans.length === 0) {
        // Initial setup: seed sample scans into Firestore
        for (const scan of INITIAL_SAMPLE_SCANS) {
          await saveScanToFirestore(scan).catch(() => {});
        }
      }
    } catch (e) {
      console.warn('Firestore sync fallback to local cache:', e);
    }
    return this.getScans();
  },
};

export const getScanHistory = () => storageService.getScans();
export const getScanById = (id: string) => storageService.getScanById(id);
export const saveScanToHistory = (scan: ScanResult) => storageService.saveScan(scan);
export const deleteScanFromHistory = (id: string) => storageService.deleteScan(id);
export const updateHazardInScan = (scanId: string, hazardId: string, _fixed?: boolean) =>
  storageService.toggleHazardFixed(scanId, hazardId);
export const resetToSampleData = () => {
  storageService.resetToDefaults();
  return storageService.getScans();
};
export const syncFirestoreScans = () => storageService.syncWithFirestore();
