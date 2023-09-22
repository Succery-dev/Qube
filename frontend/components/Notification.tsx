import React, { useEffect } from "react";

import { useNotificationContext } from "../context";
import Image from "next/image";

// Framer-Motion Imports
import { motion, AnimatePresence } from "framer-motion";
import { modalVariant } from "../utils";

const Notification = (): JSX.Element | null => {
  const context = useNotificationContext();
  const showNotification = context.showNotification;
  const setShowNotification = context.setShowNotification;
  const notificationConfiguration = context.notificationConfiguration;

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setShowNotification(false);
    }, 15000);

    return () => {
      clearTimeout(timeOut);
    };
  }, [showNotification]);

  return (
    <AnimatePresence>
      {showNotification && (
        <motion.div
          variants={modalVariant("left")}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="fixed top-8 right-8 z-[101] text-white p-4 shadow-card min-w-[300px] rounded-lg"
          style={{ background: notificationConfiguration.modalColor }}
        >
          {/* Notification-Wrapper */}
          <div className="rounded-sm px-2 py-[0.3rem] text-sm outline-none flex flex-row items-center gap-8">
            {/* Notification Status Icon */}
            <div>
              <Image
                src={notificationConfiguration.icon}
                alt={notificationConfiguration.title}
                height={40}
              />
            </div>
            <div>
              {/* Notification Message */}
              <div className="flex flex-col">
                <h3 className="font-bold text-2xl">
                  {notificationConfiguration.title}
                </h3>
                <p className="font-normal text-secondary text-xl">
                  {notificationConfiguration.message}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;
