import { Link, Outlet, useLocation } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import PageLayout from "@/router/PageLayout";

export default function MyAccountPage() {
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname.startsWith(path)
      ? "text-[#000] font-semibold"
      : "text-[#6B7280] hover:text-black";

  return (
    <PageLayout>
      <Box className="flex min-h-[calc(100vh-80px)] bg-[#F3F4F6]">

        {/* ===== LEFT SIDEBAR (GRAY, LIKE MAKCET) ===== */}
        <Box className="w-[220px] bg-[#E5E7EB] p-6 flex flex-col gap-4 border-r border-gray-300">
          <div className="text-sm uppercase text-gray-500 tracking-wide">
            Мій акаунт
          </div>

          <Link
            to="/myaccount/profile"
            className={`flex items-center gap-2 ${isActive("/myaccount/profile")}`}
          >
            👤 Профіль
          </Link>

          <div className="text-sm mt-3 text-gray-500">Оголошення</div>

          <Link to="/myaccount/listings/active" className={isActive("/myaccount/listings/active")}>
            ✔️ Активні
          </Link>

          <Link to="/myaccount/listings/pending" className={isActive("/myaccount/listings/pending")}>
            ⏳ На розгляді
          </Link>

          <Link to="/myaccount/listings/rejected" className={isActive("/myaccount/listings/rejected")}>
            ❌ Відхилені
          </Link>

          <Link to="/myaccount/listings/deleted" className={isActive("/myaccount/listings/deleted")}>
            🗃 Неактивні
          </Link>

          <Link
            to="/myaccount/user-settings"
            className={`mt-3 flex items-center gap-2 ${isActive("/myaccount/user-settings")}`}
          >
            ⚙️ Налаштування
          </Link>
        </Box>

        {/* ===== RIGHT CONTENT ===== */}
        <Box className="flex-1 bg-white p-8 shadow-inner">
          <Outlet />
        </Box>
      </Box>
    </PageLayout>
  );
}
