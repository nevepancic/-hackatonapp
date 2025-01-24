-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types for better data consistency
CREATE TYPE user_role AS ENUM ('admin', 'partner');
CREATE TYPE content_status AS ENUM ('draft', 'in_review', 'approved', 'rejected');
CREATE TYPE ticket_status AS ENUM ('pending', 'approved', 'denied');

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    full_name TEXT NOT NULL,
    company_name TEXT,
    role user_role NOT NULL DEFAULT 'partner',
    mfa_enabled BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Attractions table
CREATE TABLE attractions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    short_description TEXT,
    long_description TEXT,
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    opening_hours JSONB,
    status content_status DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Tickets table
CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attraction_id UUID NOT NULL REFERENCES attractions(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    validity_start TIMESTAMP WITH TIME ZONE,
    validity_end TIMESTAMP WITH TIME ZONE,
    status ticket_status DEFAULT 'pending',
    feedback TEXT,
    -- Media fields
    image_url TEXT,
    video_url TEXT,
    barcode_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Create indexes
CREATE INDEX idx_attractions_user ON attractions(user_id);
CREATE INDEX idx_attractions_status ON attractions(status);
CREATE INDEX idx_tickets_attraction ON tickets(attraction_id);
CREATE INDEX idx_tickets_status ON tickets(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc', now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER set_timestamp_users
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_attractions
    BEFORE UPDATE ON attractions
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_tickets
    BEFORE UPDATE ON tickets
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE attractions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile"
    ON users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
    ON users FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    ));

-- Attractions policies
CREATE POLICY "Partners can view their own attractions"
    ON attractions FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Partners can create attractions"
    ON attractions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Partners can update their own attractions"
    ON attractions FOR UPDATE
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Tickets policies
CREATE POLICY "Partners can view tickets for their attractions"
    ON tickets FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM attractions
        WHERE attractions.id = tickets.attraction_id
        AND attractions.user_id = auth.uid()
    ));

CREATE POLICY "Partners can create tickets"
    ON tickets FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM attractions
        WHERE attractions.id = attraction_id
        AND attractions.user_id = auth.uid()
    ));

CREATE POLICY "Partners can update their tickets"
    ON tickets FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM attractions
        WHERE attractions.id = attraction_id
        AND attractions.user_id = auth.uid()
    ));

-- Admins can do everything
CREATE POLICY "Admins have full access to attractions"
    ON attractions FOR ALL
    USING (EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    ));

CREATE POLICY "Admins have full access to tickets"
    ON tickets FOR ALL
    USING (EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )); 