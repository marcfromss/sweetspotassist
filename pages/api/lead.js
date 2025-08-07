export default function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, phone, source } = req.body;
    res.status(200).json({ message: 'Lead received', data: { name, email, phone, source } });
  } else {
    res.status(405).end();
  }
}