export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST allowed' });
  }

  try {
    console.log("🌐 Full request body:", JSON.stringify(req.body, null, 2));
  } catch (e) {
    console.error("❌ Failed to stringify req.body:", e);
  }

  res.status(200).json({ ok: true });
}



import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST allowed' });
  }

  const body = req.body;
  const { submission_id, answers } = body.data || {};

  // Helper to fetch answers by question label
  const getAnswer = (label) =>
    answers.find((a) => a.question?.toLowerCase().includes(label.toLowerCase()))?.answer;

  const firstName = getAnswer('first name');
  const lastName = getAnswer('last name');
  const email = getAnswer('email');
  const phone = getAnswer('phone number');
  const instagram = getAnswer('instagram');
  const whyJoin = getAnswer('why do you want to join');
  const whatLookingFor = getAnswer('what are you looking for');

  const lookingForArray = Array.isArray(whatLookingFor)
    ? whatLookingFor
    : [whatLookingFor].filter(Boolean); // Ensure it's always an array

  const { error } = await supabase.from('form_responses').insert([
    {
      response_id: submission_id,
      first_name: firstName,
      last_name: lastName,
      email,
      phone_number: phone,
      instagram_handle: instagram,
      why_join: whyJoin,
      what_looking_for: lookingForArray,
      raw: body
    }
  ]);

  if (error) {
    console.error('Supabase insert error:', error);
    return res.status(500).json({ error });
  }

  res.status(200).json({ success: true });
}

