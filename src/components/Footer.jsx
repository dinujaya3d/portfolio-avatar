export default function Footer({ name = 'Your Name' }) {
  return (
    <footer className="foot">
      <span>© {new Date().getFullYear()} {name}. Built with patience.</span>
      <span>v2 · balance.css</span>
    </footer>
  );
}
