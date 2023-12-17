export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t py-5 px-7 text-zinc-400 text-center">
      <small>&copy; {currentYear}. All rights reserved.</small>
    </footer>
  );
}
