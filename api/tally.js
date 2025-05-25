import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  const { email, instagram_handle } = req.body.data;
  const { error } = await supabase.from("form_submissions").insert([{ email, instagram_handle }]);
  if (error) return res.status(500).json({ error });
  return res.status(200).json({ success: true });
}