import { useState, useCallback } from "react";
import React from "react";

/* ══════════════════════════════════════════════════════════════
   UTILITIES
══════════════════════════════════════════════════════════════ */
function parseTOC(text) {
  const lines = text.split("\n").filter((l) => l.trim());
  const rows = [];
  let sl = 1;
  for (const line of lines) {
    const dm = line.match(/(\d{2}\.\d{2}\.\d{4})/);
    if (!dm) continue;
    const dateStr = dm[1];
    const rest = line.slice(line.indexOf(dateStr) + dateStr.length).trim();
    const pm = rest.match(/(\d+[-–]\d+|\d+)\s*$/);
    const pageNo = pm ? pm[1] : "";
    const content = pm ? rest.slice(0, rest.lastIndexOf(pm[0])).trim() : rest;
    rows.push({ sl: String(sl++), date: dateStr, content, pageNo });
  }
  return rows;
}

/* ══════════════════════════════════════════════════════════════
   DESIGN TOKENS
══════════════════════════════════════════════════════════════ */
const C = {
  bg: "#0f0f0f", surface: "#161616", surface2: "#1e1e1e",
  border: "#2a2a2a", text1: "#f0f0f0", text2: "#a0a0a0", text3: "#606060",
  red: "#c8102e", redDim: "#8b0b1f", redBg: "#1a0508",
  green: "#22c55e", gold: "#f59e0b",
};
const inp = {
  padding: "8px 11px", fontSize: 13, border: `1.5px solid ${C.border}`,
  borderRadius: 8, background: C.surface2, color: C.text1,
  outline: "none", width: "100%", boxSizing: "border-box",
  fontFamily: "inherit", transition: "border-color .15s",
};
const ta = { ...inp, fontFamily: "monospace", fontSize: 11, resize: "vertical", lineHeight: 1.55, minHeight: 130 };

function Field({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: C.text2, letterSpacing: ".04em" }}>{label}</label>
      {children}
    </div>
  );
}
function Btn({ children, onClick, variant = "primary", disabled, style: sx = {} }) {
  const base = { padding: "9px 16px", fontSize: 12, fontWeight: 700, border: "none", borderRadius: 8, cursor: disabled ? "not-allowed" : "pointer", transition: "all .15s", fontFamily: "inherit", ...sx };
  const variants = {
    primary: { background: C.red, color: "#fff", opacity: disabled ? 0.5 : 1 },
    ghost: { background: "transparent", color: C.text2, border: `1.5px solid ${C.border}` },
    danger: { background: C.redBg, color: C.red, border: `1.5px solid ${C.redDim}` },
  };
  return <button onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant] }}>{children}</button>;
}

/* ══════════════════════════════════════════════════════════════
   PAGE CONSTANTS  (A4: 595.5 × 842 pt)
══════════════════════════════════════════════════════════════ */
const PAGE = { widthPt: 595.5, heightPt: 842 };
const COVER_FONT = `"Times New Roman", Times, serif`;
const LOGO_SRC   = "/image/logo.png";

const PAGE_BORDER = { offsetPt: 18, color: "#000000" };

/* ══════════════════════════════════════════════════════════════
   COVER PAGE BLOCKS
══════════════════════════════════════════════════════════════ */
const RECORD_GAP = 28;
const SUBMIT_GAP = 20;
const FOOTER_DOWN = 36;

const BLOCKS = [
  { id: "instituteName", text: "KRISTU JAYANTI INSTITUTE OF TECHNOLOGY",      top: 153.12,                      fontPt: 16, letterSpacing: "-0.3pt", corr: 4.32 },
  { id: "recordOn",      text: "Record on",                                    top: 218.4,                       fontPt: 20, corr: 4.32 },
  { id: "courseTitle",   text: "MACHINE LEARNING PRACTICAL",                   top: 252.48 + RECORD_GAP,         fontPt: 18, lineHeightPt: 25.2, corr: 6.24 },
  { id: "courseCode",    text: "(25MCA1L221)",                                  top: 283.2  + RECORD_GAP,         fontPt: 18, corr: 3.36 },
  { id: "semester",      text: "II Semester MCA",                              top: 356.64 + RECORD_GAP,         fontPt: 20, corr: 4.8  },
  { id: "academicYear",  text: "For the academic year 2025 - 2026",            top: 379.2  + RECORD_GAP,         fontPt: 20, corr: 4.32 },
  { id: "submittedBy",   text: "Submitted by",                                 top: 423.84 + RECORD_GAP + SUBMIT_GAP, fontPt: 16, corr: 3.36 },
  { id: "studentName",   text: "RINNAH REZIAH S",                              top: 445.92 + RECORD_GAP + SUBMIT_GAP, fontPt: 16, corr: 4.32 },
  { id: "rollNumber",    text: "25MCAC40",                                     top: 466.56 + RECORD_GAP + SUBMIT_GAP, fontPt: 16, corr: 4.32 },
];

const FOOTER_BLOCK = {
  lines: [
    { text: "KRISTU JAYANTI (DEEMED TO BE UNIVERSITY)", top: 588.48 + FOOTER_DOWN, corr: 3.36 },
    { text: "K. Narayanapura, Kothanur Post,",          top: 615.36 + FOOTER_DOWN, corr: 3.36 },
    { text: "Bengaluru-560077",                          top: 643.2  + FOOTER_DOWN, corr: 3.36 },
  ],
  fontPt: 16,
};

/* ══════════════════════════════════════════════════════════════
   DOUBLE BORDER HELPER
══════════════════════════════════════════════════════════════ */
function DoubleBorder({ scale }) {
  const o = PAGE_BORDER.offsetPt * scale;
  const gap = 5 * scale;
  return (
    <>
      {/* Outer — thicker */}
      <div style={{
        position: "absolute", top: o, left: o, right: o, bottom: o,
        border: `${3.5 * scale}px solid #000`,
        pointerEvents: "none", zIndex: 10,
      }} />
      {/* Inner — thinner */}
      <div style={{
        position: "absolute",
        top: o + gap, left: o + gap, right: o + gap, bottom: o + gap,
        border: `${1.5 * scale}px solid #000`,
        pointerEvents: "none", zIndex: 10,
      }} />
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   SHARED COMPONENTS
══════════════════════════════════════════════════════════════ */
function A4Shell({ scale, children }) {
  const W = PAGE.widthPt  * scale;
  const H = PAGE.heightPt * scale;

  return (
    <div style={{
      position: "relative", width: W, height: H,
      minWidth: W, minHeight: H, maxWidth: W, maxHeight: H,
      background: "#ffffff", overflow: "hidden",
      boxSizing: "border-box", fontFamily: COVER_FONT,
    }}>
      <DoubleBorder scale={scale} />
      {children}
    </div>
  );
}

function PageContent({ scale, children }) {
  return (
    <div style={{ position: "absolute", top: 0, left: 0, width: PAGE.widthPt * scale, height: PAGE.heightPt * scale }}>
      {children}
    </div>
  );
}

function KJHeader({ scale, logoSrc }) {
  const L = { top: 44.64, left: 138.24, width: 334.56, height: 63.84 };
  return (
    <div style={{ position: "absolute", top: L.top * scale, left: L.left * scale, width: L.width * scale, height: L.height * scale }}>
      {logoSrc ? (
        <img src={logoSrc} alt="Kristu Jayanti University"
          style={{ width: "100%", height: "100%", display: "block", objectFit: "contain", objectPosition: "left center" }}
          draggable={false}
        />
      ) : (
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9 * scale, color: "#1a5fa8", border: `${0.5 * scale}px dashed #aac`, boxSizing: "border-box" }}>
          [KJ Logo]
        </div>
      )}
    </div>
  );
}

function TextLine({ scale, top, corr = 0, fontPt, text, letterSpacing, lineHeightPt }) {
  return (
    <div style={{
      position: "absolute",
      top: (top - corr) * scale,
      left: 0,
      width: PAGE.widthPt * scale,
      textAlign: "center",
      fontWeight: 700,
      fontSize: fontPt * scale,
      lineHeight: lineHeightPt ? `${lineHeightPt * scale}px` : `${fontPt * 1.18 * scale}px`,
      letterSpacing: letterSpacing || "normal",
      color: "#000000",
      whiteSpace: "pre",
    }}>
      {text}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   COVER PAGE
══════════════════════════════════════════════════════════════ */
function CoverPage({ scale = 1, logoSrc, f, instituteName, courseTitle, courseCode, semester, academicYear, studentName, rollNumber }) {
  const def = (id) => BLOCKS.find((b) => b.id === id).text;

  const resolved = {
    instituteName: (f ? f.instituteName : instituteName) || def("instituteName"),
    // ✅ FIX: read f.recordType so "Report on" / "Record on" updates live
    recordOn:      (f ? f.recordType    : null)          || def("recordOn"),
    courseTitle:   (f ? f.subjectName   : courseTitle)   || def("courseTitle"),
    courseCode:    f ? (f.courseCode ? `(${f.courseCode})` : def("courseCode")) : (courseCode || def("courseCode")),
    semester:      (f ? f.semester      : semester)      || def("semester"),
    academicYear:  f ? (f.academicYear ? `For the academic year ${f.academicYear}` : def("academicYear")) : (academicYear || def("academicYear")),
    submittedBy:   def("submittedBy"),
    studentName:   (f ? (f.studentName || "Student Name") : studentName) || def("studentName"),
    rollNumber:    (f ? (f.regNo       || "Reg. No")      : rollNumber)  || def("rollNumber"),
  };

  return (
    <A4Shell scale={scale}>
      <PageContent scale={scale}>
        <KJHeader scale={scale} logoSrc={logoSrc} />
        {BLOCKS.map((block) => (
          <TextLine key={block.id} scale={scale} top={block.top} corr={block.corr}
            fontPt={block.fontPt} text={resolved[block.id] ?? block.text}
            letterSpacing={block.letterSpacing} lineHeightPt={block.lineHeightPt} />
        ))}
        {FOOTER_BLOCK.lines.map((line, i) => (
          <TextLine key={`footer-${i}`} scale={scale} top={line.top} corr={line.corr} fontPt={FOOTER_BLOCK.fontPt} text={line.text} />
        ))}
      </PageContent>
    </A4Shell>
  );
}

/* ══════════════════════════════════════════════════════════════
   CERTIFICATE PAGE
══════════════════════════════════════════════════════════════ */
function CertPage({ f, scale, logoSrc }) {
  const W = PAGE.widthPt  * scale;
  const H = PAGE.heightPt * scale;
  const s = scale;
  const pad = 54 * s;

  const subjectName = f?.subjectName || "SUBJECT NAME";
  const courseCode  = f?.courseCode  || "COURSE CODE";
  const stdName     = f?.studentName || "Student Name";
  const regNo       = f?.regNo       || "Reg. No";
  const year        = f?.academicYear|| "2025 - 2026";
  const prog        = f?.programme   || "Master of Computer Applications";

  const fs = (pt) => pt * s;

  return (
    <div style={{
      position: "relative", width: W, height: H,
      background: "#fff", fontFamily: COVER_FONT,
      boxSizing: "border-box", color: "#000",
    }}>
      <DoubleBorder scale={scale} />

      <div style={{ position: "absolute", top: 0, left: 0, width: W, height: H, color: "#000" }}>
        <KJHeader scale={scale} logoSrc={logoSrc} />

        {/* Institute name */}
        <div style={{
          position: "absolute", top: 138 * s, left: 0, width: W,
          textAlign: "center", fontSize: fs(14), fontWeight: 700, color: "#000",
        }}>
          KRISTU JAYANTI INSTITUTE OF TECHNOLOGY
        </div>

        {/* Programme */}
        <div style={{
          position: "absolute", top: 188 * s, left: 0, width: W,
          textAlign: "center", fontSize: fs(18), fontWeight: 700, color: "#000",
        }}>
          {prog}
        </div>

        {/* Boxed CERTIFICATE */}
        <div style={{
          position: "absolute", top: 230 * s,
          left: 130 * s, right: 130 * s,
          border: `${2 * s}px solid #000`,
          textAlign: "center", padding: `${10 * s}px 0`,
          fontSize: fs(18), fontWeight: 700,
          letterSpacing: "0.05em", color: "#000",
        }}>
          CERTIFICATE
        </div>

        {/* Certify paragraph */}
        <div style={{
          position: "absolute", top: 320 * s,
          left: pad, right: pad,
          fontSize: fs(12), lineHeight: `${20 * s}px`,
          textAlign: "justify", color: "#000",
        }}>
          {"This is to certify that "}
          <strong>{stdName}</strong>
          {" bearing roll number "}
          <strong>{regNo}</strong>
          {" has satisfactorily completed the practical programs for the course "}
          <strong>{subjectName}, {courseCode}</strong>
          {" during the academic year "}
          <strong>{year}</strong>
          {"."}
        </div>

        {/* Date & Faculty in-charge */}
        <div style={{
          position: "absolute", top: 430 * s, left: pad, right: pad,
          display: "flex", justifyContent: "space-between",
          fontSize: fs(12), fontWeight: 700, color: "#000",
        }}>
          <span>Date:</span>
          <span>Faculty in-charge</span>
        </div>

        {/* HOD */}
        <div style={{
          position: "absolute", top: 490 * s, left: pad, right: pad,
          textAlign: "right", fontSize: fs(12), fontWeight: 700, color: "#000",
        }}>
          Head of the Department
        </div>

        {/* Examiners — two-column layout matching PDF */}
        <div style={{
          position: "absolute", top: 550 * s, left: pad, right: pad,
          fontSize: fs(12), color: "#000",
        }}>
          <div style={{ fontWeight: 400, color: "#000", marginBottom: 18 * s }}>
            Examiners (Name &amp; Signature)
          </div>
          {/* Row: signature lines LEFT | Center + Date RIGHT */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            {/* Left: numbered signature lines */}
            <div style={{ display: "flex", flexDirection: "column", gap: 22 * s }}>
              <div style={{ color: "#000", display: "flex", alignItems: "flex-end", gap: 6 * s }}>
                <span>1.</span>
                <span style={{ display: "inline-block", borderBottom: `${1 * s}px solid #000`, width: 130 * s }} />
              </div>
              <div style={{ color: "#000", display: "flex", alignItems: "flex-end", gap: 6 * s }}>
                <span>2.</span>
                <span style={{ display: "inline-block", borderBottom: `${1 * s}px solid #000`, width: 130 * s }} />
              </div>
            </div>
            {/* Right: Center and Date aligned to right edge */}
            <div style={{ fontSize: fs(12), color: "#000", textAlign: "left" }}>
              <div>Center: Kristu Jayanti University</div>
              <div style={{ marginTop: 16 * s }}>Date:</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   TOC PAGE
══════════════════════════════════════════════════════════════ */
function TOCPage({ f, scale, logoSrc }) {
  const W    = PAGE.widthPt  * scale;
  const H    = PAGE.heightPt * scale;
  const rows = parseTOC(f?.tocContent || "");
  const s    = scale;

  const tblPad  = 50 * s;
  const tblTop  = 148 * s;
  const tblW    = W - tblPad * 2;

  const col = [
    tblW * 0.09,
    tblW * 0.14,
    tblW * 0.65,
    tblW * 0.12,
  ];

  const cellStyle = (extra = {}) => ({
    border: "1px solid #000",
    padding: `${6 * s}px ${8 * s}px`,
    fontSize: 10 * s,
    verticalAlign: "top",
    fontFamily: COVER_FONT,
    color: "#000",
    ...extra,
  });

  return (
    <div style={{
      position: "relative", width: W, height: H,
      background: "#fff", fontFamily: COVER_FONT,
      boxSizing: "border-box", overflow: "hidden", color: "#000",
    }}>
      <DoubleBorder scale={scale} />

      <div style={{ position: "absolute", top: 0, left: 0, width: W, color: "#000" }}>
        <KJHeader scale={scale} logoSrc={logoSrc} />

        {/* Table of Contents heading */}
        <div style={{
          position: "absolute", top: 120 * s, left: 0, width: W,
          textAlign: "center", fontSize: 14 * s, fontWeight: 700, color: "#000",
        }}>
          Table of Contents
        </div>

        {/* Table */}
        <div style={{ position: "absolute", top: tblTop, left: tblPad, width: tblW }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <colgroup>
              {col.map((w, i) => <col key={i} style={{ width: w }} />)}
            </colgroup>
            <thead>
              <tr>
                {["Sl. No.", "Date", "Content", "Page No"].map((h) => (
                  <th key={h} style={{
                    ...cellStyle({
                      textAlign: "center", fontWeight: 700,
                      fontSize: 11 * s, background: "#fff",
                      border: "2px solid #000", color: "#000",
                    })
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={4} style={cellStyle({ textAlign: "center", color: "#999" })}>No TOC entries yet</td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.sl}>
                    <td style={cellStyle({ textAlign: "center" })}>{r.sl}.</td>
                    <td style={cellStyle({ textAlign: "center" })}>{r.date}</td>
                    <td style={cellStyle()}>{r.content}</td>
                    <td style={cellStyle({ textAlign: "center" })}>{r.pageNo}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   PREVIEW MODAL
══════════════════════════════════════════════════════════════ */
function PreviewModal({ template, onClose, onSave }) {
  const [f, setF]   = useState(template);
  const [pg, setPg] = useState("cover");
  const SCALE       = 0.52;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.88)", zIndex: 100, display: "flex", flexDirection: "column" }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "12px 20px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: C.text1 }}>Preview — {f.subjectName || "Template"}</div>
        <div style={{ display: "flex", gap: 6, marginLeft: "auto" }}>
          {[["cover", "Cover"], ["cert", "Certificate"], ["toc", "TOC"]].map(([id, label]) => (
            <button key={id} onClick={() => setPg(id)} style={{
              padding: "6px 12px", fontSize: 11, fontWeight: 600,
              border: `1.5px solid ${pg === id ? C.red : C.border}`, borderRadius: 6,
              background: pg === id ? C.red : "transparent",
              color: pg === id ? "#fff" : C.text2, cursor: "pointer",
            }}>{label}</button>
          ))}
        </div>
        <Btn onClick={() => { onSave(f); onClose(); }}>💾 Save</Btn>
        <Btn variant="ghost" onClick={onClose}>✕ Close</Btn>
      </div>
      <div style={{ flex: 1, background: "#666", overflowY: "auto", display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 24px", gap: 24 }}>
        {pg === "cover" && <CoverPage f={f} scale={SCALE} logoSrc={LOGO_SRC} />}
        {pg === "cert"  && <CertPage  f={f} scale={SCALE} logoSrc={LOGO_SRC} />}
        {pg === "toc"   && <TOCPage   f={f} scale={SCALE} logoSrc={LOGO_SRC} />}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   DEFAULTS
══════════════════════════════════════════════════════════════ */
const DEFAULT_TOC = `18.12.2026  Write a program using Python to implement Linear Regression on Housing Prices to predict median house value.  1-3
05.01.2026  Write a program using Python to implement Logistic Regression on the Breast Cancer Wisconsin Dataset to classify tumors as malignant or benign.  4-6
08.01.2026  Write a program using Python to implement k-Nearest Neighbors (kNN) on the Iris Dataset to predict flower species.  7-9
12.01.2026  Write a program using Python to implement a Decision Tree Classifier on the Titanic Dataset to predict passenger survival.  10-16`;

const DEFAULT_F = {
  instituteName: "KRISTU JAYANTI INSTITUTE OF TECHNOLOGY",
  subjectName: "", courseCode: "", recordType: "Record on",
  semester: "II Semester MCA", academicYear: "2025 - 2026",
  programme: "Master of Computer Applications",
  studentName: "", regNo: "", tocContent: DEFAULT_TOC,
};

const SEMESTERS = [
  "I Semester MCA", "II Semester MCA", "III Semester MCA", "IV Semester MCA",
  "I Semester BCA", "II Semester BCA", "III Semester BCA",
  "IV Semester BCA", "V Semester BCA", "VI Semester BCA",
];

/* ══════════════════════════════════════════════════════════════
   CREATE TEMPLATE PAGE
══════════════════════════════════════════════════════════════ */
export default function CreateTemplatePage({ onSave, onCancel }) {
  const [f, setF]         = useState({ ...DEFAULT_F });
  const [tab, setTab]     = useState("course");
  const [pg, setPg]       = useState("cover");
  const [saved, setSaved] = useState(false);
  const [preview, setPreview] = useState(false);
  const up = useCallback((k, v) => setF((prev) => ({ ...prev, [k]: v })), []);
  const SCALE = 0.52;

  const handleSave = () => {
    if (!f.subjectName.trim()) { alert("Please enter a subject name."); return; }
    if (!f.courseCode.trim())  { alert("Please enter a course code.");  return; }
    onSave({ ...f, id: Date.now(), createdAt: new Date().toISOString().slice(0, 10) });
    setSaved(true);
    setTimeout(onCancel, 800);
  };

  return (
    <>
      {preview && <PreviewModal template={f} onClose={() => setPreview(false)} onSave={(u) => setF(u)} />}

      <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: C.bg }}>

        {/* ── LEFT FORM ── */}
        <div style={{ width: 370, minWidth: 370, display: "flex", flexDirection: "column", borderRight: `1px solid ${C.border}`, background: C.surface }}>

          {/* Header */}
          <div style={{ padding: "18px 20px 14px", borderBottom: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, background: C.red, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>📋</div>
              <div>
                <div style={{ fontSize: 17, fontWeight: 700, color: C.text1 }}>Create Template</div>
                <div style={{ fontSize: 11, color: C.text3, marginTop: 1 }}>Admin — define subject, record type &amp; course details</div>
              </div>
            </div>
          </div>

          {/* Student callout */}
          <div style={{ padding: "10px 20px", background: "#0a180a", borderBottom: "1px solid #1a3a1a" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#4caf50", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 8 }}>
              🎓 Student fills these — leave blank or prefill
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <Field label="Student Name">
                <input style={inp} value={f.studentName} placeholder="Student fills this" onChange={(e) => up("studentName", e.target.value)} />
              </Field>
              <Field label="Reg. Number">
                <input style={{ ...inp, width: 120 }} value={f.regNo} placeholder="e.g. 25MCAC40" onChange={(e) => up("regNo", e.target.value)} />
              </Field>
            </div>
          </div>

          {/* Tab bar */}
          <div style={{ display: "flex", borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
            {[["course", "📚 Course"], ["institute", "🏫 Institute"], ["toc", "📄 TOC"]].map(([id, label]) => (
              <button key={id} onClick={() => setTab(id)} style={{
                flex: 1, padding: "9px 4px", fontSize: 11, fontWeight: 600,
                background: "none", border: "none", cursor: "pointer",
                color: tab === id ? C.text1 : C.text3,
                borderBottom: tab === id ? `2px solid ${C.red}` : "2px solid transparent",
              }}>{label}</button>
            ))}
          </div>

          {/* Fields */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
            {tab === "course" && (
              <>
                <div style={{ padding: "8px 12px", background: C.redBg, borderRadius: 8, border: `1px solid ${C.redDim}`, fontSize: 11, color: "#f87171" }}>
                  ✦ Admin-defined — students cannot change these
                </div>
                <Field label="Subject Name *">
                  <input style={inp} value={f.subjectName} placeholder="e.g. MACHINE LEARNING PRACTICAL" onChange={(e) => up("subjectName", e.target.value)} />
                </Field>
                <Field label="Course Code *">
                  <input style={inp} value={f.courseCode} placeholder="e.g. 25MCA1L221" onChange={(e) => up("courseCode", e.target.value)} />
                </Field>
                <Field label="Document Type *">
                  <select style={inp} value={f.recordType} onChange={(e) => up("recordType", e.target.value)}>
                    <option value="Record on">Record on</option>
                    <option value="Report on">Report on</option>
                  </select>
                </Field>
                <div style={{ border: `1px solid ${C.border}`, borderRadius: 8, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: C.text2, textTransform: "uppercase" }}>📅 Semester &amp; Year</div>
                  <Field label="Semester *">
                    <select style={inp} value={f.semester} onChange={(e) => up("semester", e.target.value)}>
                      {SEMESTERS.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </Field>
                  <Field label="Academic Year">
                    <input style={inp} value={f.academicYear} placeholder="e.g. 2025 - 2026" onChange={(e) => up("academicYear", e.target.value)} />
                  </Field>
                </div>
                <Field label="Programme">
                  <input style={inp} value={f.programme} placeholder="e.g. Master of Computer Applications" onChange={(e) => up("programme", e.target.value)} />
                </Field>
              </>
            )}
            {tab === "institute" && (
              <>
                <Field label="Institute Name">
                  <input style={inp} value={f.instituteName} onChange={(e) => up("instituteName", e.target.value)} />
                </Field>
                <div style={{ fontSize: 11, color: C.text3, fontStyle: "italic" }}>University name and logo are fixed as per KJ branding.</div>
                <div style={{ border: `1px solid ${C.border}`, borderRadius: 8, padding: "12px 14px", background: C.surface2 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: C.text2, textTransform: "uppercase", marginBottom: 8 }}>📍 Fixed University Address</div>
                  <div style={{ fontSize: 12, color: C.text2, lineHeight: 1.9 }}>
                    KRISTU JAYANTI (DEEMED TO BE UNIVERSITY)<br />K. Narayanapura, Kothanur Post,<br />Bengaluru-560077
                  </div>
                </div>
              </>
            )}
            {tab === "toc" && (
              <>
                <div style={{ fontSize: 11, color: C.text2, background: C.surface2, padding: "10px 12px", borderRadius: 6, lineHeight: 1.7 }}>
                  One row per line:<br />
                  <span style={{ fontFamily: "monospace", fontSize: 10, color: "#aaa" }}>DD.MM.YYYY  Description  Pages</span><br />
                  <span style={{ fontSize: 10, color: C.text3 }}>Example: 18.12.2026  Linear Regression  1-3</span>
                </div>
                <Field label="TOC Rows">
                  <textarea style={ta} value={f.tocContent} onChange={(e) => up("tocContent", e.target.value)} rows={18} />
                </Field>
              </>
            )}
          </div>

          {/* Footer */}
          <div style={{ flexShrink: 0, borderTop: `1px solid ${C.border}`, padding: "12px 20px", display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", gap: 5 }}>
              {[["cover", "Cover"], ["cert", "Certificate"], ["toc", "TOC"]].map(([id, label]) => (
                <button key={id} onClick={() => setPg(id)} style={{
                  flex: 1, padding: "6px 4px", fontSize: 10, fontWeight: 700,
                  border: `1.5px solid ${pg === id ? C.red : C.border}`, borderRadius: 6,
                  background: pg === id ? C.red : "transparent",
                  color: pg === id ? "#fff" : C.text3, cursor: "pointer",
                }}>{label}</button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <Btn variant="ghost" onClick={onCancel} style={{ flex: 1 }}>Cancel</Btn>
              <Btn variant="ghost" onClick={() => setPreview(true)} style={{ flex: 1, color: C.gold, borderColor: "#78450a" }}>👁 Preview</Btn>
              <Btn onClick={handleSave} disabled={saved} style={{ flex: 2 }}>{saved ? "✓ Saved!" : "💾 Save Template"}</Btn>
            </div>
          </div>
        </div>

        {/* ── RIGHT LIVE PREVIEW ── */}
        <div style={{ flex: 1, background: "#5a5a5a", overflowY: "auto", display: "flex", flexDirection: "column", alignItems: "center", padding: "28px 24px", gap: 16 }}>
          <div style={{ alignSelf: "flex-start", fontSize: 10, fontWeight: 700, color: "#ccc", textTransform: "uppercase", letterSpacing: ".1em" }}>
            Live Preview — {pg === "cover" ? "Cover Page" : pg === "cert" ? "Certificate Page" : "Table of Contents"}
          </div>
          {pg === "cover" && <CoverPage f={f} scale={SCALE} logoSrc={LOGO_SRC} />}
          {pg === "cert"  && <CertPage  f={f} scale={SCALE} logoSrc={LOGO_SRC} />}
          {pg === "toc"   && <TOCPage   f={f} scale={SCALE} logoSrc={LOGO_SRC} />}
        </div>

      </div>
    </>
  );
}