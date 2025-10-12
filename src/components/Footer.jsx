export default function Footer() {
  return (
    <footer className="w-full bg-gray-100 text-center py-6 mt-16">
      <p className="text-gray-600">
        © {new Date().getFullYear()} Reactors. Built with using React + Tailwind.
        -By Reactors
      </p>
    </footer>
  );
}
