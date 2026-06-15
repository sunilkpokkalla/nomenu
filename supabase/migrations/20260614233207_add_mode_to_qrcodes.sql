ALTER TABLE qr_codes ADD COLUMN mode text DEFAULT 'dine_in';
UPDATE qr_codes SET mode = 'dine_in' WHERE mode IS NULL;
