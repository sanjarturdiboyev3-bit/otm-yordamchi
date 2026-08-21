const pptxgen = require("pptxgenjs");

async function createPresentation({
  topic,
  subject,
  degree,
  slides,
  reja = [],
}) {
  const pptx = new pptxgen();

  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "OTM Yordamchi";
  pptx.subject = topic;
  pptx.title = topic;
  pptx.company = "OTM Yordamchi";
  pptx.lang = "uz-UZ";

  pptx.theme = {
    headFontFace: "Aptos Display",
    bodyFontFace: "Aptos",
    lang: "uz-UZ",
  };

  // =========================
  // 1. MUQOVA
  // =========================

  let cover = pptx.addSlide();

  cover.background = { color: "F5F7FA" };

  cover.addText(subject || "Fan", {
    x: 0.7,
    y: 1.1,
    w: 11.8,
    h: 0.5,
    fontFace: "Aptos",
    fontSize: 20,
    bold: true,
    color: "555555",
    align: "center",
  });

  cover.addText(topic || "Mavzu", {
    x: 0.7,
    y: 2.0,
    w: 11.8,
    h: 1.5,
    fontFace: "Aptos Display",
    fontSize: 34,
    bold: true,
    color: "1F2937",
    align: "center",
    valign: "mid",
    margin: 0.05,
  });

  cover.addText(degree || "OTM (bakalavriat)", {
    x: 2,
    y: 4.0,
    w: 9.3,
    h: 0.5,
    fontSize: 17,
    color: "666666",
    align: "center",
  });

  cover.addText("OTM Yordamchi — AI taqdimot generatori", {
    x: 1.5,
    y: 6.5,
    w: 10.3,
    h: 0.4,
    fontSize: 13,
    color: "777777",
    align: "center",
  });

  // =========================
  // 2. REJA
  // =========================

  if (reja.length) {
    const planSlide = pptx.addSlide();

    planSlide.addText("MAVZU REJASI", {
      x: 0.7,
      y: 0.45,
      w: 11.8,
      h: 0.6,
      fontSize: 27,
      bold: true,
      color: "1F2937",
    });

    reja.forEach((item, index) => {
      planSlide.addText(`${index + 1}. ${item}`, {
        x: 1.0,
        y: 1.4 + index * 0.9,
        w: 10.7,
        h: 0.65,
        fontSize: 20,
        color: "333333",
        breakLine: false,
        valign: "mid",
        margin: 0.05,
      });
    });
  }

  // =========================
  // 3. ASOSIY 15 TA SLAYD
  // =========================

  for (let i = 0; i < slides.length; i++) {
    const item = slides[i];

    const slide = pptx.addSlide();

    slide.background = { color: "FFFFFF" };

    const section = Number(item.section || 1);

    slide.addText(`${section}-BO‘LIM`, {
      x: 0.6,
      y: 0.3,
      w: 2.5,
      h: 0.3,
      fontSize: 11,
      bold: true,
      color: "666666",
      margin: 0,
    });

    slide.addText(item.title || `Slayd ${i + 1}`, {
      x: 0.6,
      y: 0.75,
      w: 12.0,
      h: 0.75,
      fontSize: 25,
      bold: true,
      color: "1F2937",
      margin: 0.03,
      breakLine: false,
    });

    // -------------------------
    // Bulletlar
    // -------------------------

    const bullets = Array.isArray(item.bullets)
      ? item.bullets
      : [];

    const bulletText = bullets.map((text) => ({
      text: String(text),
      options: {
        bullet: {
          indent: 17,
        },
        hanging: 4,
        breakLine: true,
      },
    }));

    slide.addText(bulletText, {
      x: 0.8,
      y: 1.7,
      w: 11.5,
      h: 3.8,
      fontSize: 15,
      color: "303030",
      breakLine: false,
      valign: "top",
      margin: 0.05,
      paraSpaceAfterPt: 10,
      fit: "shrink",
    });

    // -------------------------
    // KEY — asosiy g‘oya
    // -------------------------

    if (item.key) {
      slide.addText("ASOSIY G‘OYA", {
        x: 0.8,
        y: 5.75,
        w: 2.0,
        h: 0.3,
        fontSize: 10,
        bold: true,
        color: "666666",
        margin: 0,
      });

      slide.addText(item.key, {
        x: 0.8,
        y: 6.05,
        w: 11.4,
        h: 0.65,
        fontSize: 14,
        italic: true,
        bold: true,
        color: "333333",
        valign: "mid",
        margin: 0.04,
        fit: "shrink",
      });
    }

    // -------------------------
    // Pastki qism
    // -------------------------

    slide.addText(`${i + 1}`, {
      x: 12.2,
      y: 7.05,
      w: 0.5,
      h: 0.25,
      fontSize: 9,
      color: "888888",
      align: "right",
      margin: 0,
    });
  }

  // =========================
  // 4. YAKUNIY SLAYD
  // =========================

  const endSlide = pptx.addSlide();

  endSlide.background = { color: "F5F7FA" };

  endSlide.addText("E’TIBORINGIZ UCHUN RAHMAT", {
    x: 0.8,
    y: 2.5,
    w: 11.5,
    h: 0.8,
    fontSize: 30,
    bold: true,
    align: "center",
    color: "1F2937",
  });

  endSlide.addText(topic || "", {
    x: 1.5,
    y: 3.5,
    w: 10,
    h: 0.6,
    fontSize: 17,
    align: "center",
    color: "666666",
  });

  return pptx;
}

module.exports = {
  createPresentation,
};
