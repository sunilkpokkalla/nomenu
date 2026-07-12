ALTER TABLE loyalty_cards ADD COLUMN IF NOT EXISTS redeemed_cycles INT DEFAULT 0;

CREATE OR REPLACE FUNCTION redeem_loyalty_cycle(target_card_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE loyalty_cards
  SET 
    stamps = GREATEST(0, stamps - 10),
    redeemed_cycles = COALESCE(redeemed_cycles, 0) + 1
  WHERE id = target_card_id;
END;
$$;
