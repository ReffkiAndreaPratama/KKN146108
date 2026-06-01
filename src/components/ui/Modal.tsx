"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

const sizeMap = { sm: 380, md: 480, lg: 560 };

export function Modal({ open, onClose, title, children, size = "md" }: ModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{ position:"fixed", inset:0, zIndex:50, display:"flex", alignItems:"center", justifyContent:"center", padding:16, background:"rgba(0,0,0,0.7)", backdropFilter:"blur(8px)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 12 }}
            transition={{ type: "spring", damping: 24, stiffness: 320 }}
            style={{ position:"relative", width:"100%", maxWidth:sizeMap[size], maxHeight:"90vh", overflowY:"auto", background:"#0f1a2e", border:"1px solid rgba(255,255,255,0.08)", borderRadius:20, boxShadow:"0 25px 50px -12px rgba(0,0,0,0.6)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            {title && (
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"18px 24px", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
                <h3 style={{ color:"#fff", fontWeight:700, fontSize:16, margin:0 }}>{title}</h3>
                <button onClick={onClose}
                  style={{ width:32, height:32, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", background:"transparent", border:"none", color:"#64748b", cursor:"pointer" }}>
                  <X style={{ width:16, height:16 }} />
                </button>
              </div>
            )}
            {!title && (
              <button onClick={onClose}
                style={{ position:"absolute", top:16, right:16, zIndex:10, width:32, height:32, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", background:"transparent", border:"none", color:"#64748b", cursor:"pointer" }}>
                <X style={{ width:16, height:16 }} />
              </button>
            )}
            <div style={{ padding:24 }}>{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
