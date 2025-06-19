// pages/api/get-user-email.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "@/lib/supabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: "No userId" });

  const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId as string);
  if (error) return res.status(500).json({ error: error.message });

  res.status(200).json({ email: data.user?.email });
}