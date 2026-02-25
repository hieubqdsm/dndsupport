const fs = require('fs');
let content = fs.readFileSync('data/spells.ts', 'utf8');

const translations = {
    "Acid Arrow": {
        label: `Mũi Tên Axit`,
        description: `Bắn một mũi tên lục quang phun trào axit tạc thẳng vào mặt địch xa 90ft. Tung một đòn Ranged spell attack. Trúng: Mục tiêu cháy da dính 4d4 sát thương axit NGAY TỨC KHẮC, rồi bám riết cháy thêm 2d4 axit nữa vào cuối lượt sau của nó. NHƯNG NẾU NHẮM TRƯỢT Mũi tên sượt vẫn văng bắn toé tạc axit dính 1/2 sát thương ban đầu (Không có DOT kéo dài).`
    },
    "Animal Friendship": {
        label: `Thân Thiện Thú Hoang`,
        description: `Niệm chú xoa dịu một con Thú (Beast) hung hăng trong tầm mắt. (Phải là thú đần: Intelligence < 4). Con thú phải tung Wisdom saving throw. Nếu thất bại, nó ngoan ngoãn bị Mê Hoặc (Charmed) bởi bạn ròng rã 24 giờ. Cấm bạn và đồng đội động thủ đánh nó nếu không bùa đứt cước ngay.`
    },
    "Animal Messenger": {
        label: `Sứ Giả Muông Thú`,
        description: `Vẫy 1 con thú tí hon cỏn con (Sóc, Quạ, Dơi) nhờ chạy việc vặt bưu điện. Chép lại tin nhắn 25 chữ, dặn con vật "Chuyển tới ông lão đội nón chóp ở rừng sương". Chim cõng thông điệp bay nhẫn nại (Bay 50 miles/ngày, Đi bộ 25 miles/ngày). Đến nơi nó ríu rít nói y chang câu ghi âm cho đúng người nhận nghe. Đi sai đường sập giờ nó tự lủi về.`
    },
    "Animal Shapes": {
        label: `Đại Hình Thú Nổi Loạn`,
        description: `Đại phép biến hình tập thể đồng đội THÀNH Bầy thú hoang vã. Có thể biến BAO NHIÊU người CŨNG ĐƯỢC tùy chỉ tay chọn miễn họ tình nguyện, VỚI max CR dưới 4 (Voi, Gấu trắng..). Máu cày của mỗi người được Mặc 1 Lớp Áo Máu con Thú. Cứ hễ Máu thú bị chẻ nát thì lớp áo vỡ => Họ bật văng ra người lại trọn vẹn. Trong lúc duy trì 24 giờ đỉnh cao, bạn DÙNG ACTION TỪNG TURN HÔ BIẾN HỌ THÀNH CON THÚ KHÁC MỚI TINH TRẦN.`
    },
    "Antilife Shell": {
        label: `Lớp Vỏ Chống Yêu Cuồng`,
        description: `Dựng cầu sương bảo hộ 10ft bám xung quanh tâm điểm bản thân. Chặn đứng hoàn toàn bất cứ sinh vật sống thịt thà nào bước lọt vào lưới ngọc! (NHƯNG Trừ bọn thắp đuốc mọt Undead với Cỗ máy Constructs). Bạn có thể tự do phóng chưởng TỪ TRONG bắn chọc RA NGOÀI mà không hề hấn gì. CẤM: Đừng dại dột đi ủi đẩy lùa màng chắn này hất vào mặt kẻ địch, NẾU KHÔNG bong bóng sẽ tự bóp nát vỡ mất.`
    },
    "Antipathy/Sympathy": {
        label: `Bài Xích/Đồng Cảm`,
        description: `Dán mác phân loại Hệ Loài cho 1 ngọn núi hoang/địa điểm (200ft) hoặc vào 1 vật/Cá Thể (Size Cực lớn đổ lại). BÀI XÍCH (Antipathy) khiến hệ chủng loại bị bêu tên (VD: bọn Rồng Đỏ) Tự Động Phải Test WIS Save mỗi khi lảng vãng tới ranh giới 60ft! Nếu FAIL, nó Khóc thét, mang mác Sợ (Frightened) Chạy Thụt Mạng Rẽ Lối Tìm Về xó tắt k hòng lại gần. ĐỒNG CẢM (Sympathy) gài nam châm 60ft bắt WIS save hụt chân thì Ngả Ngớn Mê Mẩn đòi lết lết dính sát vô tới cột đó trốn không nổi đụng tay mó thì mới vỡ bùa.`
    },
    "Arcane Eye": {
        label: `Mắt Thần Bí Phép`,
        description: `Nhào nặn tiểu xảo 1 nhãn cầu vô hình chói sáng. Trực thăng camera vô hạn dây điều khiển xăm xới trong bóng tối (Darkvision 30ft). Tốc độ lượn là tốn 1 Action đẩy nó rích rắc mỗi cú nhích bay 30ft. Độc tôn chỗ là Mắt Cam soi chui lọt đủ kẽ hở to ngang lỗ khóa đĩa than 1 Inch cặn lõi.`
    },
    "Arcane Lock": {
        label: `Khóa Ma Thuật Tối Thượng`,
        description: `Đóng nắp khóa sụm chết 1 cái rương ván, ổ cửa rích sắt, cổng đá toòng. Bạn và người bạn cấp giấy phép thì Nắm tay kéo chốt nó tự êm ru. Cài đặt thêm 1 MẬT KHẨU MIỆNG 5ft vọng tiếng thốt vờn ổ thì Khóa xụp ngủ trong 1 PHÚT. Người ngoài băm bổ cạy bẻ Phá Cửa thì còng lưng ăn chát DC Bẻ Khóa Cộng cộm thêm +10 điểm cực nhọc đứt gãy đinh sắt.`
    },
    "Arcane Sword": {
        label: `Kiếm Phép Khảm Nạm Băng Không`,
        description: `Trời giáng 1 thanh kiếm Phép Thuật khổng lồ rớt xuống đè xé họng địch thủ chỉ định 60ft. Test dọng 1 nhát Quật Melee Spell Attack khứa máu điếc 3d10 điểm lực ma Force damage. Bạn thảnh thơi điều binhển nó bay rượt địch thủ nhấp nháy chuyển làn 20ft bằng Lệnh Bonus Action ở các lượt sau.`
    },
    "Arcanist's Magic Aura": {
        label: `Hào Quang Ma Phép Che Đậy`,
        description: `Bòn rút Lừa Đảo bộ Radar Phép. Niệm ngụy trang vuốt vờ 1 Vật Vô Hình hoặc Một Ai Đó cho mờ ảnh nhận diện. TÙY CHỌN 1 hoặc 2 chức năng xảo trá: 1) Hào Quang Giả lừa gạt đính tag Magic vào thanh củi hoặc Che đậy món thánh khí rực rỡ như đồ phế liệu hòng trốn Detect Magic. 2) Mặt Nạ Giả Bảng Định Danh: Ngụy trang loài của Bạn đánh tráo (Ví dụ: Kẻ thù paladin chiếu Divine Sense quét bạn thì tưởng nhầm bạn bị thọt nách biến thành Fey hoặc Quỷ Fiend).`
    },
    "Astral Projection": {
        label: `Xuất Hồn Phóng Tinh Tú`,
        description: `Bày biện đại lễ thăng thiên tập thể kéo nhúm hồn 8 người bạn ra lìa khỏi XÁC MẸ. Xác ngủ đình trệ Không thở không khát không già nua. HỒN phạc vút lên không giới tuyến bay lơ lửng Cõi Tinh Tú Astral Plane. Sau lưng của mỗi Hồn Phách đính kèm sợi Dây Rốn Cáp Bạc Tàng Hình neo kết với XÁC Gốc. Chỉ khi nào bị kẻ nghịch chặt dứt Sợi Cáp này, hồn bạn bốc hơi Xóa Sổ (Chết Thật). Còn nếu bị đánh bầm dập Máu Hồn rớt Zero, Hồn tự Cụp đuôi chui tọt về Xác mẹ thức giấc Ồn Ào.`
    },
    "Augury": {
        label: `Sấm Truyền Tiên Tri`,
        description: `Làm phép sóc bài, tung xương cốt rồng khấn 1 đấng bề trên Hỏi dò Đoán Sự 30 Phút Tới Nữa Đây Nào? Cụ Thần Tinh Linh sẽ trả lời gọng cụt 1 trong 4 quẻ súc tích: LÀNH (Weal), DỮ TAI BIẾN (Woe), NỬA LÀNH NỬA MẺ (Weal and woe) HOẶC VÔ THƯỞNG VÔ PHẠT KHÔNG DỔI (Nothing). (Lạm dụng hỏi đi hỏi lại ngay thì Thần cáu ngầm phạt sai tỷ lệ xúc 25%.)`
    },
    "Awaken": {
        label: `Thức Tỉnh Khai Trí Cây Cối`,
        description: `Rờ gắn chuôi xâu Ngọc Tinh Chất vuốt râu đầu 1 Gốc cây hay 1 con Thú Khù khờ cạn não (Intelligence nhỏ hơn 3). Truyền não bộ thông minh Intel = 10, dại cho nó nói được một thứ tiếng bạn giỏi. GỐC Cây được ban tứ chi rễ mọc đi lại như người và nhận Giác Quan mắt sáng xòe. Nó ghi ân đội lốt Tôn Thờ Bạn 30 ngày Trăng Charmed (Hết 30 ngày nó đi bụi hay trung thành hên xui).`
    },
    "Bane": {
        label: `Tai Ương Lời Rủa`,
        description: `Kéo xui xẻo rụi lụt trùm lên 3 kẻ địch đang nhe răng trong vòng 30ft. Tụi nó phải test (CHA save). Nếu tạch, bóng mờ xui rủi của bạn đu bám bứt lông chọc cùi chỏ MỖI LẦN NÓ ĐÁNH Attack Tấn công bạn, HOẶC MỖI LẦN NÓ SAVE NÉ Tội Lỗi VÀI MÔI TRƯỜNG đều bị lôi Tuột Xuống trừ vỡ nát âm 1d4 chỉ số tung xúc xắc xui bét bè be.`
    },
    "Banishment": {
        label: `Bạch Trục Xuất`,
        description: `Tống cổ 1 tên phàm phu hít đất lên ngắm sao hoả văng xác chằng chịt! O ép Kháng cự (Charisma save). NẾU TÊN ẤY Ở LŨNG ĐẦU MẶT ĐẤT NÀY THÌ Rơi tùn mù vào Chiều Không Gian Câm Lặng (Demiplane) hóa đá bất dung 1 phút. NẾU NÓ LÀ QUỶ FIEND TỪ GIỚI VỰC KHÁC thì Tóm cổ đút Lỗ hổng Trượt về thẳng Quê của nó Không kèn. Ép nhốt vắt kiệt tâm lực Concentration chuẩn 1 Phút Tròn là Bọn Fiend Nhát Khứ Hồi Vĩnh Viễn Mất Dấu!!`
    }
};

let matchCount = 0;
for (const [name, trans] of Object.entries(translations)) {
    const regex = new RegExp('(\\{\\s*name:\\s*"' + name + '"[\\s\\S]*?label:\\s*")([^"]+)("[\\s\\S]*?description:\\s*")([^"]+)("\\s*\\})', 'g');
    if (regex.test(content)) {
        content = content.replace(regex, (match, p1, p2, p3, p4, p5) => {
            let desc = trans.description.replace(/"/g, '\\\\\\"'); // Escape quotes for TS
            return p1 + trans.label + p3 + desc + p5;
        });
        matchCount++;
    } else {
        console.log("Could not match: " + name);
    }
}

fs.writeFileSync('data/spells.ts', content);
console.log("Replaced " + matchCount + " spells.");
