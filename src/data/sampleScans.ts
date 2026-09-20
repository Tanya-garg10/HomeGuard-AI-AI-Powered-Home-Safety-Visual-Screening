import { ScanResult } from '../types';

// Curated high quality room imagery for seamless demoing
export const SAMPLE_ROOM_IMAGES = {
  livingRoomBefore:
    'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1200&q=80',
  livingRoomAfter:
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
  homeOffice:
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1200&q=80',
  kitchen:
    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
  hallway:
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
};

export const INITIAL_SAMPLE_SCANS: ScanResult[] = [
  {
    id: 'scan-living-room-before',
    title: 'Living Room (Baseline Scan)',
    roomName: 'Living Room',
    createdAt: '2026-09-18T14:32:00Z',
    imageUrl: SAMPLE_ROOM_IMAGES.livingRoomBefore,
    overallScore: 68,
    summary: '4 potential visible safety concerns identified across electrical and walkway areas.',
    categories: {
      electrical: 55,
      fire: 72,
      accessibility: 70,
      environment: 78,
    },
    isDemo: true,
    notes: 'Baseline screening before rearranging living room furniture and cable management.',
    hazards: [
      {
        id: 'hazard-lr-1',
        title: 'Potential electrical overload',
        category: 'Electrical Safety',
        severity: 'high',
        confidence: 0.88,
        description:
          'Multiple heavy power cables and secondary extension bricks appear daisy-chained near the entertainment unit floor area.',
        whyItMatters:
          'A heavily loaded power strip or daisy-chained adapter can increase conductor heating, electrical arching risk, and breaker tripping.',
        recommendation:
          'Disconnect secondary multi-plugs. Route high-draw electronics directly into wall receptacles and verify cord thermal conditions.',
        location: {
          x: 62,
          y: 68,
          width: 22,
          height: 18,
        },
      },
      {
        id: 'hazard-lr-2',
        title: 'Blocked walkway & trip obstruction',
        category: 'Accessibility',
        severity: 'medium',
        confidence: 0.84,
        description:
          'Loose storage cartons and decorative floor items appear positioned directly in the primary path between seating and corridor doorway.',
        whyItMatters:
          'Narrowed or obstructed walkways significantly increase trip-and-fall incidents, especially in dim evening lighting or during emergency evacuations.',
        recommendation:
          'Clear floor items to maintain a continuous, unobstructed travel path at least 32 inches wide across the room.',
        location: {
          x: 32,
          y: 56,
          width: 26,
          height: 25,
        },
      },
      {
        id: 'hazard-lr-3',
        title: 'Combustible material near heat source',
        category: 'Fire Safety',
        severity: 'medium',
        confidence: 0.81,
        description:
          'Fabric throw blanket and paper stack appear draped within close proximity to a visible floor space heater / radiator vent.',
        whyItMatters:
          'Thermal radiant heat can dry and ignite synthetic fabrics or paper goods left within 3 feet of active heating appliances.',
        recommendation:
          'Maintain at least 3 feet (1 meter) of clear buffer space around any space heater, baseboard, or active heat vent.',
        location: {
          x: 74,
          y: 42,
          width: 18,
          height: 22,
        },
      },
      {
        id: 'hazard-lr-4',
        title: 'Poor visibility & loose trailing cable',
        category: 'General Environment',
        severity: 'low',
        confidence: 0.77,
        description:
          'A black charging lead extends loosely across the darker area of the area rug without floor channel protection.',
        whyItMatters:
          'Low contrast trailing cables are difficult to detect visually and present sudden snag and trip hazards.',
        recommendation:
          'Fasten or secure cables along baseboards using adhesive clips or an approved low-profile floor cord protector.',
        location: {
          x: 18,
          y: 76,
          width: 28,
          height: 14,
        },
      },
    ],
  },
  {
    id: 'scan-living-room-after',
    title: 'Living Room (Post-Resolution Rescan)',
    roomName: 'Living Room',
    createdAt: '2026-09-20T10:15:00Z',
    imageUrl: SAMPLE_ROOM_IMAGES.livingRoomAfter,
    overallScore: 92,
    summary:
      'Significant improvement: 3 issues resolved. Only 1 low-severity minor advisory remains.',
    categories: {
      electrical: 94,
      fire: 95,
      accessibility: 91,
      environment: 88,
    },
    isDemo: true,
    notes: 'Rescan after power strip consolidation and removing walkway clutter.',
    hazards: [
      {
        id: 'hazard-lr-after-1',
        title: 'Minor trailing device lead',
        category: 'General Environment',
        severity: 'low',
        confidence: 0.69,
        description:
          'Small phone charger cable rests near the side console; path is otherwise wide, clean, and well-lit.',
        whyItMatters:
          'Minor snag potential if stepped on, though minimal risk to general movement.',
        recommendation:
          'Roll up or coil charging lead onto the side table cable organizer dock.',
        location: {
          x: 24,
          y: 72,
          width: 16,
          height: 12,
        },
      },
    ],
  },
  {
    id: 'scan-home-office',
    title: 'Home Office Workstation',
    roomName: 'Home Office',
    createdAt: '2026-09-17T09:20:00Z',
    imageUrl: SAMPLE_ROOM_IMAGES.homeOffice,
    overallScore: 74,
    summary: '2 potential visible concerns noted around desk wiring and chair clearance.',
    categories: {
      electrical: 64,
      fire: 86,
      accessibility: 78,
      environment: 68,
    },
    isDemo: true,
    hazards: [
      {
        id: 'hazard-ho-1',
        title: 'Exposed cable bundle under desk',
        category: 'Electrical Safety',
        severity: 'medium',
        confidence: 0.85,
        description:
          'Tangled cluster of computer power cords, monitors, and hubs hanging directly into footrest leg space.',
        whyItMatters:
          'Repeated foot contact can tug cords loose, strain port connectors, or cause sudden snagging and short circuits.',
        recommendation:
          'Use an under-desk cable management tray or spiral wrap to bundle cables cleanly off the floor.',
        location: {
          x: 48,
          y: 62,
          width: 25,
          height: 24,
        },
      },
      {
        id: 'hazard-ho-2',
        title: 'Tight egress behind desk chair',
        category: 'Accessibility',
        severity: 'low',
        confidence: 0.74,
        description:
          'Bookcase and storage tower create a tight pinch point behind the rolling office chair.',
        whyItMatters:
          'Limits smooth roll-back motion and quick exit clearance in an urgent situation.',
        recommendation:
          'Shift storage unit 6-8 inches sideways to provide smooth 360-degree chair clearance.',
        location: {
          x: 15,
          y: 40,
          width: 20,
          height: 35,
        },
      },
    ],
  },
  {
    id: 'scan-kitchen',
    title: 'Kitchen & Prep Counter',
    roomName: 'Kitchen',
    createdAt: '2026-09-15T18:45:00Z',
    imageUrl: SAMPLE_ROOM_IMAGES.kitchen,
    overallScore: 81,
    summary: '2 moderate items detected near cooktop appliance radius.',
    categories: {
      electrical: 88,
      fire: 74,
      accessibility: 85,
      environment: 77,
    },
    isDemo: true,
    hazards: [
      {
        id: 'hazard-kt-1',
        title: 'Paper towel roll near burner radius',
        category: 'Fire Safety',
        severity: 'medium',
        confidence: 0.86,
        description:
          'Paper towel stand appears stationed less than 12 inches away from the rear stovetop burner range.',
        whyItMatters:
          'Flames, grease spatter, or radiant stovetop heating can ignite paper goods placed within immediate perimeter.',
        recommendation:
          'Relocate paper goods and wooden utensil blocks to the dry prep counter at least 2 feet from burners.',
        location: {
          x: 58,
          y: 45,
          width: 15,
          height: 22,
        },
      },
      {
        id: 'hazard-kt-2',
        title: 'Wet floor reflection near sink area',
        category: 'General Environment',
        severity: 'low',
        confidence: 0.72,
        description:
          'Surface sheen near the sink cabinet indicates potential water droplets or moisture slick on tile.',
        whyItMatters:
          'Smooth ceramic tile becomes extremely slick when wet, presenting sudden slip hazards.',
        recommendation:
          'Wipe surface dry and position an anti-slip absorbent kitchen floor mat in front of the sink station.',
        location: {
          x: 35,
          y: 78,
          width: 22,
          height: 14,
        },
      },
    ],
  },
];

export const SAMPLE_SCANS = INITIAL_SAMPLE_SCANS;
