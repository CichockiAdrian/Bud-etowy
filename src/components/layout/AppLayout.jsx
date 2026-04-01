import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import BottomNav from "./BottomNav";
import FAB from "../shared/FAB";

// Only animate between top-level tabs, not sub-pages
const TAB_ROOTS = ["/", "/analiza", "/historia"];

const variants = {
  initial: { opacity: 0, x: 16 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -16 },
};

function getTabKey(pathname) {
  return TAB_ROOTS.find((r) => r !== "/" && pathname.startsWith(r)) || "/";
}

export default function AppLayout() {
  const location = useLocation();
  const tabKey = getTabKey(location.pathname);

  return (
    <div className="min-h-screen bg-background font-nunito max-w-lg mx-auto relative overflow-hidden">
      <div className="pb-20">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tabKey}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.18, ease: "easeInOut" }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </div>
      <FAB />
      <BottomNav />
    </div>
  );
}
