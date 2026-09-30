import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import {
  INITIAL_CITIZEN,
  INITIAL_COLLECTOR,
  COLLECTORS_LIST,
  INITIAL_COMPLAINTS,
  INITIAL_PICKUPS,
  INITIAL_HOTSPOTS,
  INITIAL_AWARENESS_ARTICLES,
  INITIAL_NOTIFICATIONS,
} from './src/data/mockData.ts';
import {
  Complaint,
  PickupRequest,
  Collector,
  WasteHotspot,
  AwarenessArticle,
  AppNotification,
  UserProfile,
  ComplaintStatus,
  PickupStatus,
} from './src/types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-Memory Database State with persistent backup file option
let db = {
  citizen: { ...INITIAL_CITIZEN },
  collectors: [...COLLECTORS_LIST],
  complaints: [...INITIAL_COMPLAINTS],
  pickups: [...INITIAL_PICKUPS],
  hotspots: [...INITIAL_HOTSPOTS],
  articles: [...INITIAL_AWARENESS_ARTICLES],
  notifications: [...INITIAL_NOTIFICATIONS],
};

const DB_FILE = path.resolve(__dirname, '.db_state.json');

// Try load saved DB if exists
try {
  if (fs.existsSync(DB_FILE)) {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    db = JSON.parse(raw);
  }
} catch (e) {
  console.log('Starting with fresh in-memory database state');
}

function saveDb() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    // Non-fatal if filesystem is read-only
  }
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json({ limit: '15mb' }));

  // ==================== REST API ENDPOINTS ====================

  // 1. Health & Server Info
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      app: 'Smart Waste Management System',
      version: '2.4.0',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    });
  });

  // 2. Comprehensive Statistics & Analytics
  app.get('/api/stats', (_req: Request, res: Response) => {
    const totalComplaints = db.complaints.length;
    const resolvedComplaints = db.complaints.filter((c) => c.status === 'Resolved').length;
    const pendingComplaints = db.complaints.filter(
      (c) => c.status === 'Pending' || c.status === 'Assigned' || c.status === 'In Progress'
    ).length;
    const totalPickups = db.pickups.length;
    const completedPickups = db.pickups.filter((p) => p.status === 'Completed').length;
    const activeCollectors = db.collectors.filter((c) => c.status !== 'Off Duty').length;

    // Category distribution
    const categoryCounts: Record<string, number> = {};
    db.complaints.forEach((c) => {
      categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
    });

    // Status distribution
    const statusCounts: Record<string, number> = {};
    db.complaints.forEach((c) => {
      statusCounts[c.status] = (statusCounts[c.status] || 0) + 1;
    });

    res.json({
      totalUsers: 1420,
      totalComplaints,
      resolvedComplaints,
      pendingComplaints,
      totalPickups,
      completedPickups,
      activeCollectors,
      totalCollectors: db.collectors.length,
      categoryCounts,
      statusCounts,
      resolutionRate: Math.round((resolvedComplaints / (totalComplaints || 1)) * 100),
      timestamp: new Date().toISOString(),
    });
  });

  // 3. Complaints Endpoints
  app.get('/api/complaints', (req: Request, res: Response) => {
    const { status, category, priority, search } = req.query;
    let list = [...db.complaints];

    if (status && status !== 'All') {
      list = list.filter((c) => c.status === status);
    }
    if (category && category !== 'All') {
      list = list.filter((c) => c.category === category);
    }
    if (priority && priority !== 'All') {
      list = list.filter((c) => c.priority === priority);
    }
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.id.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.citizenName.toLowerCase().includes(q) ||
          c.location.address.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
      );
    }

    res.json(list);
  });

  app.get('/api/complaints/:id', (req: Request, res: Response) => {
    const item = db.complaints.find((c) => c.id === req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Complaint not found' });
    }
    res.json(item);
  });

  app.post('/api/complaints', (req: Request, res: Response) => {
    const { category, description, imageUrl, location, priority } = req.body;

    if (!category || !description) {
      return res.status(400).json({ error: 'Category and description are required' });
    }

    const complaintNum = db.complaints.length + 126;
    const newId = `WM-2026-00${complaintNum}`;
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;

    const newComplaint: Complaint = {
      id: newId,
      category,
      description,
      imageUrl:
        imageUrl ||
        'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?w=600&auto=format&fit=crop&q=80',
      location: location || {
        lat: 28.5355,
        lng: 77.241,
        address: 'Sector 14, New Delhi',
        area: 'Sector 14',
      },
      submittedDate: formattedDate,
      status: 'Pending',
      priority: priority || 'High',
      citizenName: db.citizen.name,
      citizenPhone: db.citizen.phone,
      citizenEmail: db.citizen.email,
      timeline: [
        {
          id: 't1',
          title: 'Complaint Submitted',
          description: 'Report lodged with geotagged photo by citizen.',
          timestamp: formattedDate,
          status: 'completed',
        },
        {
          id: 't2',
          title: 'Admin Reviewed',
          description: 'Awaiting review by Sanitation Officer.',
          status: 'current',
        },
        {
          id: 't3',
          title: 'Collector Assigned',
          description: 'Waste collection vehicle dispatch.',
          status: 'upcoming',
        },
        {
          id: 't4',
          title: 'Work In Progress',
          description: 'Collector actively clearing reported waste site.',
          status: 'upcoming',
        },
        {
          id: 't5',
          title: 'Complaint Resolved',
          description: 'Area cleaned and verified with photographic proof.',
          status: 'upcoming',
        },
      ],
    };

    db.complaints.unshift(newComplaint);
    db.citizen.totalComplaintsReported += 1;
    db.citizen.ecoKarmaPoints += 25;

    // Add alert notification
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Complaint Registered',
      message: `Your report #${newId} for ${category} has been received by Sanitation Control.`,
      timestamp: 'Just now',
      read: false,
      type: 'complaint',
      targetId: newId,
    };
    db.notifications.unshift(notif);

    // Update matching hotspot stats
    db.hotspots = db.hotspots.map((hs) =>
      hs.areaName.toLowerCase().includes(newComplaint.location.area.toLowerCase())
        ? { ...hs, totalComplaints: hs.totalComplaints + 1, pendingComplaints: hs.pendingComplaints + 1 }
        : hs
    );

    saveDb();
    res.status(201).json(newComplaint);
  });

  app.patch('/api/complaints/:id/status', (req: Request, res: Response) => {
    const { status, notes, proofUrl } = req.body as {
      status: ComplaintStatus;
      notes?: string;
      proofUrl?: string;
    };

    const index = db.complaints.findIndex((c) => c.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    const complaint = db.complaints[index];
    const now = new Date();
    const timestamp = `${now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}, ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;

    const updatedTimeline = complaint.timeline.map((step) => {
      if (status === 'Assigned' && step.title === 'Collector Assigned') {
        return { ...step, status: 'completed' as const, timestamp };
      }
      if (status === 'In Progress' && step.title === 'Work In Progress') {
        return { ...step, status: 'current' as const, timestamp };
      }
      if (status === 'Resolved' && step.title === 'Complaint Resolved') {
        return { ...step, status: 'completed' as const, timestamp };
      }
      if (status === 'Resolved') {
        return { ...step, status: 'completed' as const };
      }
      return step;
    });

    db.complaints[index] = {
      ...complaint,
      status,
      resolutionNotes: notes || complaint.resolutionNotes,
      resolutionProofUrl: proofUrl || complaint.resolutionProofUrl,
      timeline: updatedTimeline,
    };

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: `Complaint #${complaint.id} ${status}`,
      message: `Your waste report status is now marked as ${status}.`,
      timestamp: 'Just now',
      read: false,
      type: 'complaint',
      targetId: complaint.id,
    };
    db.notifications.unshift(notif);

    saveDb();
    res.json(db.complaints[index]);
  });

  app.post('/api/complaints/:id/assign', (req: Request, res: Response) => {
    const { collectorId } = req.body;
    const collector = db.collectors.find((c) => c.id === collectorId);
    if (!collector) {
      return res.status(404).json({ error: 'Collector not found' });
    }

    const index = db.complaints.findIndex((c) => c.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    const complaint = db.complaints[index];
    const now = new Date();
    const timestamp = `${now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}, ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;

    const updatedTimeline = complaint.timeline.map((step) => {
      if (step.title === 'Admin Reviewed') {
        return { ...step, status: 'completed' as const, timestamp };
      }
      if (step.title === 'Collector Assigned') {
        return {
          ...step,
          status: 'completed' as const,
          description: `Assigned to ${collector.name} (${collector.vehicleNumber}).`,
          timestamp,
        };
      }
      if (step.title === 'Work In Progress') {
        return { ...step, status: 'current' as const };
      }
      return step;
    });

    db.complaints[index] = {
      ...complaint,
      status: 'Assigned',
      assignedCollectorId: collector.id,
      assignedCollectorName: collector.name,
      timeline: updatedTimeline,
    };

    // Update collector task count
    collector.todayComplaints += 1;
    collector.pendingTasks += 1;

    saveDb();
    res.json(db.complaints[index]);
  });

  // 4. Pickups Endpoints
  app.get('/api/pickups', (req: Request, res: Response) => {
    const { status, wasteType } = req.query;
    let list = [...db.pickups];
    if (status && status !== 'All') {
      list = list.filter((p) => p.status === status);
    }
    if (wasteType && wasteType !== 'All') {
      list = list.filter((p) => p.wasteType === wasteType);
    }
    res.json(list);
  });

  app.post('/api/pickups', (req: Request, res: Response) => {
    const { wasteType, quantity, address, area, date, timeSlot, notes } = req.body;

    const pickupNum = db.pickups.length + 1032;
    const newId = `PU-${pickupNum}`;
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;

    const newPickup: PickupRequest = {
      id: newId,
      wasteType: wasteType || 'Dry Waste',
      quantity: quantity || 'Medium (3-5 bags)',
      address: address || db.citizen.address,
      area: area || 'Sector 14',
      date: date || '30 September 2026',
      timeSlot: timeSlot || '10:00 AM - 12:00 PM',
      status: 'Waiting for Assignment',
      citizenName: db.citizen.name,
      citizenPhone: db.citizen.phone,
      notes: notes || '',
      createdAt: formattedDate,
    };

    db.pickups.unshift(newPickup);
    db.citizen.totalPickupsRequested += 1;
    db.citizen.ecoKarmaPoints += 15;

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Pickup Scheduled',
      message: `Pickup #${newId} for ${wasteType} booked for ${date} (${timeSlot}).`,
      timestamp: 'Just now',
      read: false,
      type: 'pickup',
      targetId: newId,
    };
    db.notifications.unshift(notif);

    saveDb();
    res.status(201).json(newPickup);
  });

  app.patch('/api/pickups/:id/status', (req: Request, res: Response) => {
    const { status, proofUrl } = req.body as { status: PickupStatus; proofUrl?: string };
    const index = db.pickups.findIndex((p) => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Pickup not found' });
    }

    db.pickups[index] = {
      ...db.pickups[index],
      status,
      collectorProofUrl: proofUrl || db.pickups[index].collectorProofUrl,
    };

    saveDb();
    res.json(db.pickups[index]);
  });

  app.post('/api/pickups/:id/assign', (req: Request, res: Response) => {
    const { collectorId } = req.body;
    const collector = db.collectors.find((c) => c.id === collectorId);
    if (!collector) {
      return res.status(404).json({ error: 'Collector not found' });
    }

    const index = db.pickups.findIndex((p) => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Pickup not found' });
    }

    db.pickups[index] = {
      ...db.pickups[index],
      status: 'Assigned',
      assignedCollectorId: collector.id,
      assignedCollectorName: collector.name,
    };

    collector.todayPickups += 1;
    collector.pendingTasks += 1;

    saveDb();
    res.json(db.pickups[index]);
  });

  // 5. Collectors Endpoints
  app.get('/api/collectors', (_req: Request, res: Response) => {
    res.json(db.collectors);
  });

  app.patch('/api/collectors/:id/status', (req: Request, res: Response) => {
    const { status } = req.body;
    const index = db.collectors.findIndex((c) => c.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Collector not found' });
    }
    db.collectors[index].status = status;
    saveDb();
    res.json(db.collectors[index]);
  });

  // 6. Hotspots Endpoints
  app.get('/api/hotspots', (_req: Request, res: Response) => {
    res.json(db.hotspots);
  });

  app.post('/api/hotspots/:id/dispatch', (req: Request, res: Response) => {
    const hotspot = db.hotspots.find((h) => h.id === req.params.id);
    if (!hotspot) {
      return res.status(404).json({ error: 'Hotspot not found' });
    }

    hotspot.lastReported = 'Patrol dispatched just now';
    saveDb();
    res.json({
      success: true,
      message: `Rapid Sanitation Squad dispatched to ${hotspot.areaName}`,
      hotspot,
    });
  });

  // 7. Awareness Articles CMS
  app.get('/api/awareness', (_req: Request, res: Response) => {
    res.json(db.articles);
  });

  app.post('/api/awareness', (req: Request, res: Response) => {
    const { title, category, readTime, excerpt, content, dos, donts, tips } = req.body;
    const newArticle: AwarenessArticle = {
      id: `art-${Date.now()}`,
      title,
      category,
      readTime: readTime || '3 min read',
      excerpt,
      content,
      dos: Array.isArray(dos) ? dos : [],
      donts: Array.isArray(donts) ? donts : [],
      tips: Array.isArray(tips) ? tips : [],
    };
    db.articles.unshift(newArticle);
    saveDb();
    res.status(201).json(newArticle);
  });

  app.put('/api/awareness/:id', (req: Request, res: Response) => {
    const index = db.articles.findIndex((a) => a.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Article not found' });
    }
    db.articles[index] = { ...db.articles[index], ...req.body };
    saveDb();
    res.json(db.articles[index]);
  });

  app.delete('/api/awareness/:id', (req: Request, res: Response) => {
    db.articles = db.articles.filter((a) => a.id !== req.params.id);
    saveDb();
    res.json({ success: true, message: 'Article deleted' });
  });

  // 8. Notifications
  app.get('/api/notifications', (_req: Request, res: Response) => {
    res.json(db.notifications);
  });

  app.patch('/api/notifications/:id/read', (req: Request, res: Response) => {
    const item = db.notifications.find((n) => n.id === req.params.id);
    if (item) {
      item.read = true;
      saveDb();
    }
    res.json({ success: true });
  });

  app.post('/api/notifications/read-all', (_req: Request, res: Response) => {
    db.notifications.forEach((n) => (n.read = true));
    saveDb();
    res.json({ success: true, message: 'All notifications marked as read' });
  });

  // 9. Profile
  app.get('/api/profile', (_req: Request, res: Response) => {
    res.json(db.citizen);
  });

  app.put('/api/profile', (req: Request, res: Response) => {
    db.citizen = { ...db.citizen, ...req.body };
    saveDb();
    res.json(db.citizen);
  });

  // 10. Database Reset
  app.post('/api/reset', (_req: Request, res: Response) => {
    db = {
      citizen: { ...INITIAL_CITIZEN },
      collectors: [...COLLECTORS_LIST],
      complaints: [...INITIAL_COMPLAINTS],
      pickups: [...INITIAL_PICKUPS],
      hotspots: [...INITIAL_HOTSPOTS],
      articles: [...INITIAL_AWARENESS_ARTICLES],
      notifications: [...INITIAL_NOTIFICATIONS],
    };
    try {
      if (fs.existsSync(DB_FILE)) {
        fs.unlinkSync(DB_FILE);
      }
    } catch {}
    res.json({ success: true, message: 'Database reset to initial seed data' });
  });

  // 11. GitHub Repository Metadata API
  app.get('/api/github/info', (_req: Request, res: Response) => {
    res.json({
      name: 'smart-waste-management-system',
      owner: 'satyammishra',
      fullName: 'satyammishra/smart-waste-management-system',
      description:
        'Production-grade modern municipal smart waste management platform with Citizen mobile PWA, Sanitation Collector app, and Admin Surveillance Control Room.',
      defaultBranch: 'main',
      htmlUrl: 'https://github.com/2004satyammishra/smart-waste-management-system',
      cloneUrl: 'https://github.com/2004satyammishra/smart-waste-management-system.git',
      stars: 128,
      forks: 34,
      openIssues: 2,
      license: 'MIT',
      topics: [
        'civic-tech',
        'smart-city',
        'waste-management',
        'react-19',
        'express',
        'typescript',
        'tailwindcss-v4',
        'pwa',
      ],
      techStack: {
        frontend: ['React 19', 'TypeScript', 'Tailwind CSS v4', 'Motion', 'Lucide React', 'Vite 8'],
        backend: ['Express.js', 'Node.js', 'RESTful API', 'JSON-based persistent store'],
        deployment: ['Google Cloud Run', 'Docker', 'Vite SPA'],
      },
      endpointsCount: 18,
    });
  });

  // ==================== VITE / STATIC CLIENT MOUNT ====================

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Smart Waste API & Web] Server active at http://0.0.0.0:${PORT}`);
  });
}

startServer();
