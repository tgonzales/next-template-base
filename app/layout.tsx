import "styles/tailwind.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // Light mode como default do produto: color-scheme evita que o UA pinte
    // form controls/canvas de escuro quando o SO está em dark; apps gerados
    // que quiserem dark mode devem fazer opt-in explícito (classe .dark).
    <html lang="en" className="light" style={{ colorScheme: "light" }}>
      <body className="bg-white text-gray-900">{children}</body>
    </html>
  )
}
