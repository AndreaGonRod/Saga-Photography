import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("saga.db");

// Initialize Database Schema
db.exec(`
  CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    lastName TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    instagramAccounts TEXT,
    notes TEXT,
    searchFullName TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS photoshoots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    startTime TEXT NOT NULL,
    endTime TEXT NOT NULL,
    eventDate TEXT,
    finalPrice REAL,
    status TEXT,
    dueDate TEXT,
    customTurnAround TEXT,
    commercialUsageAuthorized INTEGER DEFAULT 0,
    folderPath TEXT,
    notes TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    startTime TEXT NOT NULL,
    endTime TEXT NOT NULL,
    isFullDay INTEGER DEFAULT 0,
    finalPrice REAL,
    deposit REAL,
    status TEXT,
    dueDate TEXT,
    customTurnAround TEXT,
    commercialUsageAuthorized INTEGER DEFAULT 0,
    folderPath TEXT,
    location TEXT,
    additionalContact TEXT,
    notes TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    startTime TEXT NOT NULL,
    duration INTEGER,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    clientId INTEGER,
    photoshootId INTEGER,
    eventId INTEGER,
    dueDate TEXT,
    status TEXT DEFAULT 'PENDING',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(clientId) REFERENCES clients(id),
    FOREIGN KEY(photoshootId) REFERENCES photoshoots(id),
    FOREIGN KEY(eventId) REFERENCES events(id)
  );

  CREATE TABLE IF NOT EXISTS client_photoshoot (
    clientId INTEGER,
    photoshootId INTEGER,
    PRIMARY KEY(clientId, photoshootId),
    FOREIGN KEY(clientId) REFERENCES clients(id),
    FOREIGN KEY(photoshootId) REFERENCES photoshoots(id)
  );

  CREATE TABLE IF NOT EXISTS staff (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    lastName TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    notes TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS event_staff (
    eventId INTEGER,
    staffId INTEGER,
    PRIMARY KEY(eventId, staffId),
    FOREIGN KEY(eventId) REFERENCES events(id),
    FOREIGN KEY(staffId) REFERENCES staff(id)
  );

  CREATE TABLE IF NOT EXISTS offers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,
    subCategory TEXT,
    details TEXT,
    price REAL,
    defaultTurnAround INTEGER,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Check if duration column exists, if not add it (migration for existing DBs)
const tableInfo = db.prepare("PRAGMA table_info(appointments)").all() as any[];
const hasDuration = tableInfo.some((col: any) => col.name === 'duration');
if (!hasDuration) {
  db.prepare("ALTER TABLE appointments ADD COLUMN duration INTEGER DEFAULT 60").run();
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes

  // Clients
  app.get("/api/clients", (req, res) => {
    const clients = db.prepare(`
      SELECT c.*,
  (SELECT COUNT(*) FROM client_photoshoot WHERE clientId = c.id) as photoshootCount,
    (SELECT COUNT(*) FROM client_event WHERE clientId = c.id) as eventCount
      FROM clients c ORDER BY c.name ASC
    `).all();
    res.json(clients.map((c: any) => ({
      ...c,
      instagramAccounts: JSON.parse(c.instagramAccounts || '[]')
    })));
  });

  app.post("/api/clients", (req, res) => {
    const { name, lastName, phone, email, instagramAccounts, notes } = req.body;
    const searchFullName = `${name} ${lastName} `.toLowerCase();
    const instagramAccountsJson = JSON.stringify(instagramAccounts || []);
    const result = db.prepare(`
      INSERT INTO clients(name, lastName, phone, email, instagramAccounts, notes, searchFullName)
VALUES(?, ?, ?, ?, ?, ?, ?)
    `).run(name, lastName, phone, email, instagramAccountsJson, notes, searchFullName);
    res.status(201).json({ id: parseInt(result.lastInsertRowid.toString()), ...req.body });
  });

  app.put("/api/clients/:id", (req, res) => {
    const { id } = req.params;
    const { name, lastName, phone, email, instagramAccounts, notes } = req.body;
    const searchFullName = `${name} ${lastName} `.toLowerCase();
    const instagramAccountsJson = JSON.stringify(instagramAccounts || []);
    db.prepare(`
      UPDATE clients SET name = ?, lastName = ?, phone = ?, email = ?, instagramAccounts = ?, notes = ?, searchFullName = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
  `).run(name, lastName, phone, email, instagramAccountsJson, notes, searchFullName, id);
    res.json({ id: parseInt(id), ...req.body });
  });

  app.delete("/api/clients/:id", (req, res) => {
    const { id } = req.params;
    db.prepare("DELETE FROM clients WHERE id = ?").run(id);
    res.status(204).send();
  });

  app.get("/api/clients/search", (req, res) => {
    const { searchFullName, phone } = req.query;
    let clients;
    if (searchFullName) {
      clients = db.prepare("SELECT * FROM clients WHERE searchFullName LIKE ?").all(`% ${searchFullName.toString().toLowerCase()}% `);
    } else if (phone) {
      clients = db.prepare("SELECT * FROM clients WHERE phone LIKE ?").all(`% ${phone}% `);
    } else {
      clients = db.prepare("SELECT * FROM clients").all();
    }
    const formattedClients = clients.map((client: any) => ({
      ...client,
      instagramAccounts: client.instagramAccounts ? JSON.parse(client.instagramAccounts) : []
    }));
    res.json(formattedClients);
  });

  // Photoshoots
  app.get("/api/photoshoots", (req, res) => {
    const photoshoots = db.prepare("SELECT * FROM photoshoots ORDER BY date DESC").all();
    res.json(photoshoots);
  });

  app.post("/api/photoshoots", (req, res) => {
    const { title, date, startTime, endTime, finalPrice, status, clients, notes } = req.body;
    const result = db.prepare(`
      INSERT INTO photoshoots(title, date, startTime, endTime, finalPrice, status, notes)
VALUES(?, ?, ?, ?, ?, ?, ?)
  `).run(title, date, startTime, endTime, finalPrice, status, notes);

    const photoshootId = result.lastInsertRowid;
    if (clients && Array.isArray(clients)) {
      const stmt = db.prepare("INSERT INTO client_photoshoot (clientId, photoshootId) VALUES (?, ?)");
      clients.forEach((c: any) => stmt.run(c.id, photoshootId));
    }

    res.status(201).json({ id: parseInt(photoshootId.toString()), ...req.body });
  });

  app.put("/api/photoshoots/:id", (req, res) => {
    const { id } = req.params;
    const { title, date, startTime, endTime, finalPrice, status, clients, notes } = req.body;
    db.prepare(`
      UPDATE photoshoots SET title = ?, date = ?, startTime = ?, endTime = ?, finalPrice = ?, status = ?, notes = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
  `).run(title, date, startTime, endTime, finalPrice, status, notes, id);

    db.prepare("DELETE FROM client_photoshoot WHERE photoshootId = ?").run(id);
    if (clients && Array.isArray(clients)) {
      const stmt = db.prepare("INSERT INTO client_photoshoot (clientId, photoshootId) VALUES (?, ?)");
      clients.forEach((c: any) => stmt.run(c.id, id));
    }
    res.json({ id: parseInt(id), ...req.body });
  });

  app.delete("/api/photoshoots/:id", (req, res) => {
    const { id } = req.params;
    db.prepare("DELETE FROM client_photoshoot WHERE photoshootId = ?").run(id);
    db.prepare("DELETE FROM photoshoots WHERE id = ?").run(id);
    res.status(204).send();
  });

  app.get("/api/photoshoots/search", (req, res) => {
    const { title } = req.query;
    const photoshoots = db.prepare("SELECT * FROM photoshoots WHERE title LIKE ?").all(`% ${title}% `);
    res.json(photoshoots);
  });

  // Events
  app.get("/api/events", (req, res) => {
    const events = db.prepare("SELECT * FROM events ORDER BY date DESC").all();
    res.json(events);
  });

  app.post("/api/events", (req, res) => {
    const { title, date, startTime, endTime, location, finalPrice, status, clients, staff, notes } = req.body;
    const result = db.prepare(`
      INSERT INTO events(title, date, startTime, endTime, location, finalPrice, status, notes)
VALUES(?, ?, ?, ?, ?, ?, ?, ?)
  `).run(title, date, startTime, endTime, location, finalPrice, status, notes);

    const eventId = result.lastInsertRowid;
    if (clients && Array.isArray(clients)) {
      const stmt = db.prepare("INSERT INTO client_event (clientId, eventId) VALUES (?, ?)");
      clients.forEach((c: any) => stmt.run(c.id, eventId));
    }
    if (staff && Array.isArray(staff)) {
      const stmt = db.prepare("INSERT INTO event_staff (staffId, eventId) VALUES (?, ?)");
      staff.forEach((s: any) => stmt.run(s.id, eventId));
    }

    res.status(201).json({ id: parseInt(eventId.toString()), ...req.body });
  });

  app.put("/api/events/:id", (req, res) => {
    const { id } = req.params;
    const { title, date, startTime, endTime, location, finalPrice, status, clients, staff, notes } = req.body;
    db.prepare(`
      UPDATE events SET title = ?, date = ?, startTime = ?, endTime = ?, location = ?, finalPrice = ?, status = ?, notes = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
  `).run(title, date, startTime, endTime, location, finalPrice, status, notes, id);

    db.prepare("DELETE FROM client_event WHERE eventId = ?").run(id);
    if (clients && Array.isArray(clients)) {
      const stmt = db.prepare("INSERT INTO client_event (clientId, eventId) VALUES (?, ?)");
      clients.forEach((c: any) => stmt.run(c.id, id));
    }
    db.prepare("DELETE FROM event_staff WHERE eventId = ?").run(id);
    if (staff && Array.isArray(staff)) {
      const stmt = db.prepare("INSERT INTO event_staff (staffId, eventId) VALUES (?, ?)");
      staff.forEach((s: any) => stmt.run(s.id, id));
    }
    res.json({ id: parseInt(id), ...req.body });
  });

  app.delete("/api/events/:id", (req, res) => {
    const { id } = req.params;
    db.prepare("DELETE FROM client_event WHERE eventId = ?").run(id);
    db.prepare("DELETE FROM event_staff WHERE eventId = ?").run(id);
    db.prepare("DELETE FROM events WHERE id = ?").run(id);
    res.status(204).send();
  });

  app.get("/api/events/search", (req, res) => {
    const { text } = req.query;
    const events = db.prepare("SELECT * FROM events WHERE title LIKE ? OR location LIKE ?").all(`% ${text}% `, ` % ${text}% `);
    res.json(events);
  });

  // Count endpoints
  app.get("/api/photoshoots/count/client/:id", (req, res) => {
    const { id } = req.params;
    const count = db.prepare("SELECT COUNT(*) as count FROM client_photoshoot WHERE clientId = ?").get(id) as any;
    res.json(count.count);
  });

  app.get("/api/events/count/client/:id", (req, res) => {
    const { id } = req.params;
    const count = db.prepare("SELECT COUNT(*) as count FROM client_event WHERE clientId = ?").get(id) as any;
    res.json(count.count);
  });

  app.get("/api/events/count/staff/:id", (req, res) => {
    const { id } = req.params;
    const count = db.prepare("SELECT COUNT(*) as count FROM event_staff WHERE staffId = ?").get(id) as any;
    res.json(count.count);
  });

  // Staff
  app.get("/api/staff", (req, res) => {
    const staff = db.prepare(`
      SELECT s.*,
  (SELECT COUNT(*) FROM event_staff WHERE staffId = s.id) as eventCount
      FROM staff s ORDER BY s.name ASC
  `).all();
    res.json(staff);
  });

  app.post("/api/staff", (req, res) => {
    const { name, lastName, phone, email, notes } = req.body;
    const result = db.prepare(`
      INSERT INTO staff(name, lastName, phone, email, notes)
VALUES(?, ?, ?, ?, ?)
  `).run(name, lastName, phone, email, notes);
    res.status(201).json({ id: parseInt(result.lastInsertRowid.toString()), ...req.body });
  });

  app.put("/api/staff/:id", (req, res) => {
    const { id } = req.params;
    const { name, lastName, phone, email, notes } = req.body;
    db.prepare(`
      UPDATE staff SET name = ?, lastName = ?, phone = ?, email = ?, notes = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
  `).run(name, lastName, phone, email, notes, id);
    res.json({ id: parseInt(id), ...req.body });
  });

  app.delete("/api/staff/:id", (req, res) => {
    const { id } = req.params;
    db.prepare("DELETE FROM event_staff WHERE staffId = ?").run(id);
    db.prepare("DELETE FROM staff WHERE id = ?").run(id);
    res.status(204).send();
  });

  // Offers
  app.get("/api/offers", (req, res) => {
    const offers = db.prepare("SELECT * FROM offers ORDER BY category ASC, subCategory ASC").all();
    res.json(offers);
  });

  app.post("/api/offers", (req, res) => {
    const { category, subCategory, details, price, defaultTurnAround } = req.body;
    const result = db.prepare(`
      INSERT INTO offers(category, subCategory, details, price, defaultTurnAround)
VALUES(?, ?, ?, ?, ?)
  `).run(category, subCategory, details, price, defaultTurnAround);
    res.status(201).json({ id: parseInt(result.lastInsertRowid.toString()), ...req.body });
  });

  app.put("/api/offers/:id", (req, res) => {
    const { id } = req.params;
    const { category, subCategory, details, price, defaultTurnAround } = req.body;
    db.prepare(`
      UPDATE offers SET category = ?, subCategory = ?, details = ?, price = ?, defaultTurnAround = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
  `).run(category, subCategory, details, price, defaultTurnAround, id);
    res.json({ id: parseInt(id), ...req.body });
  });

  app.delete("/api/offers/:id", (req, res) => {
    const { id } = req.params;
    db.prepare("DELETE FROM offers WHERE id = ?").run(id);
    res.status(204).send();
  });

  app.get("/api/offers/search/category", (req, res) => {
    const { category } = req.query;
    const offers = db.prepare("SELECT * FROM offers WHERE category LIKE ?").all(`% ${category}% `);
    res.json(offers);
  });

  // Appointments
  app.get("/api/appointments", (req, res) => {
    const appointments = db.prepare("SELECT * FROM appointments ORDER BY date ASC, startTime ASC").all();
    res.json(appointments);
  });

  app.post("/api/appointments", (req, res) => {
    const { title, date, startTime, duration } = req.body;
    const result = db.prepare(`
      INSERT INTO appointments(title, date, startTime, duration)
VALUES(?, ?, ?, ?)
  `).run(title, date, startTime, duration);
    res.status(201).json({ id: parseInt(result.lastInsertRowid.toString()), ...req.body });
  });

  app.put("/api/appointments/:id", (req, res) => {
    const { id } = req.params;
    const { title, date, startTime, duration } = req.body;
    db.prepare(`
      UPDATE appointments SET title = ?, date = ?, startTime = ?, duration = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
  `).run(title, date, startTime, duration, id);
    res.json({ id: parseInt(id), ...req.body });
  });

  app.delete("/api/appointments/:id", (req, res) => {
    const { id } = req.params;
    db.prepare("DELETE FROM appointments WHERE id = ?").run(id);
    res.status(204).send();
  });

  // Schedule (Combined view)
  app.get("/api/schedule", (req, res) => {
    const { start, end } = req.query;
    let photoshoots, events, appointmentsRaw;

    if (start && end) {
      // In a real app, we would parse dd-MM-yyyy to yyyy-MM-dd for comparison,
      // but for mock parity, simple string comparison might work if format is consistent
      // or we can just return all for simplicity in the mock if logic gets too complex.
      // Logic: SELECT * FROM photoshoots WHERE date BETWEEN ? AND ?
      photoshoots = db.prepare("SELECT id, title, date, startTime, endTime, 'photoshoot' as type, status as mainStatus FROM photoshoots").all();
      events = db.prepare("SELECT id, title, date, startTime, endTime, 'event' as type, status as mainStatus FROM events").all();
      appointmentsRaw = db.prepare("SELECT id, title, date, startTime, duration, 'appointment' as type FROM appointments").all();
    } else {
      photoshoots = db.prepare("SELECT id, title, date, startTime, endTime, 'photoshoot' as type, status as mainStatus FROM photoshoots").all();
      events = db.prepare("SELECT id, title, date, startTime, endTime, 'event' as type, status as mainStatus FROM events").all();
      appointmentsRaw = db.prepare("SELECT id, title, date, startTime, duration, 'appointment' as type FROM appointments").all();
    }

    const appointments = appointmentsRaw.map((app: any) => {
      const [hours, minutes] = app.startTime.split(':').map(Number);
      const totalMinutes = hours * 60 + minutes + (app.duration || 0);
      const endHours = Math.floor(totalMinutes / 60) % 24;
      const endMinutes = totalMinutes % 60;
      const endTime = `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
      return {
        id: app.id,
        title: app.title,
        start: `${app.date} ${app.startTime}`,
        end: `${app.date} ${endTime}`,
        type: app.type
      };
    });

    const photoshootEntries = photoshoots.map((p: any) => ({
      id: p.id,
      title: p.title,
      start: `${p.date} ${p.startTime}`,
      end: `${p.date} ${p.endTime}`,
      type: p.type,
      mainStatus: p.mainStatus
    }));

    const eventEntries = events.map((e: any) => ({
      id: e.id,
      title: e.title,
      start: `${e.date} ${e.startTime}`,
      end: `${e.date} ${e.endTime}`,
      type: e.type,
      mainStatus: e.mainStatus
    }));

    res.json([...photoshootEntries, ...eventEntries, ...appointments]);
  });

  // Tasks (Missing in original mock)
  app.get("/api/tasks", (req, res) => {
    const tasks = db.prepare("SELECT * FROM tasks").all();
    res.json(tasks);
  });

  app.post("/api/tasks", (req, res) => {
    const { clientId, photoshootId, eventId, dueDate, status, itemList } = req.body;
    const result = db.prepare(`
      INSERT INTO tasks(clientId, photoshootId, eventId, dueDate, status)
VALUES(?, ?, ?, ?, ?)
    `).run(clientId, photoshootId, eventId, dueDate, status);
    // Note: itemList would need another table, for mock we just store status in tasks
    res.status(201).json({ id: parseInt(result.lastInsertRowid.toString()), ...req.body });
  });

  app.delete("/api/tasks/:id", (req, res) => {
    const { id } = req.params;
    db.prepare("DELETE FROM tasks WHERE id = ?").run(id);
    res.status(204).send();
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
