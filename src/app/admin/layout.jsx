import { MasterProvider } from "../../context/MasterContext";

export default function AdminLayout({ children }) {
  return (
    <MasterProvider>
      {children}
    </MasterProvider>
  );
}