const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async function (req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST allowed' });
  }

  try {
    const data = req.body?.data || {};
    const fields = data.fields || [];

    // Helper: get value from a label
    const getValue = (label) =>
      fields.find((f) => f.label?.toLowerCase() === label.toLowerCase())?.value;

    // Helper: extract checkbox values as readable text
    const getSelectedCheckboxes = (labelPrefix) => {
      const checkboxField = fields.find(f => f.label?.startsWith(labelPrefix));
      if (!checkboxField || !checkboxField.options) return [];

      const selectedIds = checkboxField.value || [];
      return checkboxField.options
        .filter(opt => selectedIds.includes(opt.id))
        .map(opt => opt.text);
    };

    const payload = {
      response_id: data.submissionId,
      first_name: getValue('First Name'),
      last_name: getValue('Last Name'),
      email: getValue('Email address'),
      phone_number: getValue('Phone number'),
      instagram_handle: getValue('What is your instagram handle?'),
      why_join: getValue('Why do you want to join fondue?'),
      what_looking_for: getSelectedCheckboxes('What are you looking for?'),
      raw: req.body,
    };

    const { error } = await supabase.from('form_responses').insert([payload]);

    if (error) {
      console.error("❌ Supabase insert error:", error);
      return res.status(500).json({ error });
    }

    console.log("✅ Submission stored successfully:", payload);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ Unexpected error:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
