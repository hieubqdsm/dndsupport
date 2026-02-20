
import { GoogleGenAI } from "@google/genai";
import { Character, Monster } from "../types";

// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateAICharacterVN = async (prompt: string): Promise<Character | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Hãy tạo một nhân vật D&D 5e bằng TIẾNG VIỆT dựa trên mô tả: "${prompt}". 
      Trả về JSON chính xác theo cấu trúc này. 
      Lưu ý: "className" là tên Lớp (Fighter, Wizard, etc.), "level" là số nguyên.
      Các giá trị "race", "background", "alignment" nên khớp với các thuật ngữ D&D 2024 tiêu chuẩn nếu có thể (ví dụ: Human, Soldier, Lawful Good).
      Tên kỹ năng phải khớp với danh sách tiếng Việt tiêu chuẩn (Dẻo Dai, An Hiểu Phép Thuật, ...).
      
      {
        "name": "Tên nhân vật",
        "className": "Fighter",
        "level": 1,
        "race": "Human",
        "background": "Soldier",
        "alignment": "Neutral Good",
        "stats": { "str": {"score": 15, "modifier": 2}, ... },
        "hp": {"current": 10, "max": 10, "temp": 0},
        "ac": 15,
        "initiative": 2,
        "speed": 30,
        "proficiencyBonus": 2,
        "skills": [{"name": "Dẻo Dai", "ability": "dex", "proficient": true, "bonus": 4}, ...],
        "personality": "...",
        "backstory": "...",
        "spellLevels": [...]
      }`,
      config: {
        responseMimeType: "application/json",
      }
    });

    // Extract text and trim to ensure valid JSON parsing
    const text = response.text?.trim();
    return text ? JSON.parse(text) : null;
  } catch (error) {
    console.error("Lỗi GenAI:", error);
    return null;
  }
};

export const lookupMonsterVN = async (
  term: string, 
  filters?: { type?: string; cr?: string; size?: string }
): Promise<Monster | null> => {
  try {
    let prompt = `Bạn là một từ điển quái vật Dungeons & Dragons 5e. `;
    
    if (term.trim()) {
      prompt += `Hãy tìm thông tin chi tiết về quái vật có tên: "${term}". `;
    } else {
      prompt += `Hãy gợi ý một quái vật D&D 5e điển hình phù hợp với các tiêu chí sau. `;
    }

    if (filters?.type) prompt += `Loại (Type): ${filters.type}. `;
    if (filters?.cr) prompt += `Độ khó (Challenge Rating/CR): ${filters.cr}. `;
    if (filters?.size) prompt += `Kích cỡ (Size): ${filters.size}. `;

    prompt += `
      Hãy dịch toàn bộ thông tin sang TIẾNG VIỆT sát nghĩa nhất.
      Trả về định dạng JSON duy nhất, không thêm markdown code block:
      {
        "name": "Tên quái vật (Tiếng Việt - Tiếng Anh)",
        "size": "Kích cỡ (Trung bình, Lớn, ...)",
        "type": "Loại (Humanoid, Fiend, ...)",
        "alignment": "Phe phái",
        "ac": "Chỉ số AC (Ví dụ: 15 (Giáp da))",
        "hp": "Máu (Ví dụ: 22 (4d8 + 4))",
        "speed": "Tốc độ",
        "stats": { "str": 10, "dex": 10, "con": 10, "int": 10, "wis": 10, "cha": 10 },
        "saves": "Danh sách saving throw (nếu có, ví dụ: Dex +3)",
        "skills": "Danh sách kỹ năng (nếu có)",
        "senses": "Giác quan",
        "languages": "Ngôn ngữ",
        "challenge": "Độ khó (CR) và XP",
        "traits": [{"name": "Tên đặc điểm", "desc": "Mô tả"}],
        "actions": [{"name": "Tên hành động", "desc": "Mô tả (bao gồm +hit và damage)"}],
        "legendaryActions": [{"name": "Tên", "desc": "Mô tả"}],
        "description": "Một đoạn văn ngắn mô tả hình dáng và tập tính loài này."
      }`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text?.trim();
    return text ? JSON.parse(text) : null;
  } catch (error) {
    console.error("Lỗi tra cứu quái vật:", error);
    return null;
  }
};
