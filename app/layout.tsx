import "styles/tailwind.css"
import ThemeProviders from "components/ProvidersComponents/ThemeProviders"
import ReduxProvider from "lib/providers/authProvider"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  )
}
