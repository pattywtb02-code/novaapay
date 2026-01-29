-- Add PIN hash column to profiles
ALTER TABLE public.profiles ADD COLUMN pin_hash TEXT;

-- Create OTP codes table for login verification
CREATE TABLE public.otp_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.otp_codes ENABLE ROW LEVEL SECURITY;

-- Users can view their own OTP codes
CREATE POLICY "Users can view their own OTP codes"
ON public.otp_codes
FOR SELECT
USING (auth.uid() = user_id);

-- Allow insert without auth (for login flow)
CREATE POLICY "Allow OTP insertion"
ON public.otp_codes
FOR INSERT
WITH CHECK (true);

-- Allow update for marking as used
CREATE POLICY "Allow OTP update"
ON public.otp_codes
FOR UPDATE
USING (true);

-- Create index for faster lookups
CREATE INDEX idx_otp_codes_email_code ON public.otp_codes(email, code);
CREATE INDEX idx_otp_codes_expires_at ON public.otp_codes(expires_at);