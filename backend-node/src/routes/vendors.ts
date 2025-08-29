import { Router, Request, Response } from 'express';
import db from '../db/database';
import { Vendor } from '../models/Vendor';

const router = Router();

// GET /vendors - List all vendors
router.get('/', (req: Request, res: Response) => {
    db.all('SELECT * FROM vendors', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// GET /vendors/check-email/:email - Check if email already exists
router.get('/check-email/:email', (req: Request, res: Response) => {
    const { email } = req.params;
    
    if (!email) {
        return res.status(400).json({ error: 'Email parameter is required' });
    }

    db.get('SELECT id, name FROM vendors WHERE email = ?', [email], (err, row: { id: number; name: string } | undefined) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        if (row) {
            return res.status(200).json({ 
                exists: true, 
                message: 'Email already exists',
                vendorName: row.name
            });
        }
        
        res.status(200).json({ 
            exists: false, 
            message: 'Email is available' 
        });
    });
});

// POST /vendors - Register a new vendor
router.post('/', (req: Request, res: Response) => {
    const { name, contact_person, email, partner_type } = req.body as Vendor;
    
    if (!name || !contact_person || !email || !partner_type) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (partner_type !== 'Supplier' && partner_type !== 'Partner') {
        return res.status(400).json({ error: 'partner_type must be either "Supplier" or "Partner"' });
    }

    // Check if email already exists
    db.get('SELECT id FROM vendors WHERE email = ?', [email], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        if (row) {
            return res.status(409).json({ 
                error: 'A vendor with this email already exists',
                code: 'EMAIL_CONFLICT'
            });
        }

        // Email is unique, proceed with insertion
        const sql = `INSERT INTO vendors (name, contact_person, email, partner_type) 
                     VALUES (?, ?, ?, ?)`;
        
        db.run(sql, [name, contact_person, email, partner_type], function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            
            res.status(201).json({
                id: this.lastID,
                name,
                contact_person,
                email,
                partner_type
            });
        });
    });
});

// DELETE /vendors/:id - Delete a vendor by ID
// It extracts id from URL params and validates it. If missing, returns 400.
// It uses a RETURNING clause to get the id of the deleted vendor.
// If the vendor is not found, it returns 404.
// If the vendor is found, it deletes the vendor and returns 204.
// If the vendor is not found, it returns 404.
// If the vendor is found, it deletes the vendor and returns 204.
router.delete('/:id', (req: Request, res: Response) => {
    const { id } = req.params;
  if (!id) return res.status(400).json({ error: 'Vendor id is required' });

  const sql = 'DELETE FROM vendors WHERE id = ? RETURNING id';
  db.all(sql, [id], (err, rows: Array<{ id: number }>) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!rows || rows.length === 0) return res.status(404).json({ error: 'Vendor not found' });
    return res.status(204).send();
  });
});

export default router;