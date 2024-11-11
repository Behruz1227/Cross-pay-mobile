// src/components/TermsAndConditions.tsx
import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Text, View } from "react-native";

const TermsAndConditions: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Shartlar (T&C)</Text>
      <Text style={styles.updated}>Oxirgi yangilangan: 14/10/2024</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Umumiy ma'lumot</Text>
        <Text style={styles.sectionContent}>
          Ushbu hujjat SBP QRPay ilovasidan foydalanishni boshqaradi. Bizning
          ilovamizdan foydalanish orqali foydalanuvchilar quyidagi shartlar va
          shartlarga rozilik bildiradilar.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          2. Foydalanish bo'yicha ko'rsatmalar
        </Text>
        <Text style={styles.sectionContent}>
          Sotuvchilar QR kodlarini faqat o'z xizmatlari yoki mahsulotlari bilan
          bog'liq qonuniy tranzaktsiyalar uchun yaratish uchun javobgardir.
          Uzrli sabablarsiz QR kodlarini yaratish qat'iyan man etiladi.
          {"\n\n"}
          Foydalanuvchilar barcha toʻlov tranzaksiyalari toʻgʻri bajarilishini
          taʼminlashi kerak va har qanday xatoliklar darhol xabar qilinishi
          kerak.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. To'lovni bekor qilish</Text>
        <Text style={styles.sectionContent}>
        Foydalanuvchilar tranzaktsiyadan keyin 24 soat ichida to'lovni bekor qilishlari mumkin. Ushbu muddatdan keyin bekor qilish mumkin bo'lmaydi va xaridor va sotuvchi o'rtasidagi nizolarni hal qilish kerak bo'ladi.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. To'lovlar va to'lovlar</Text>
        <Text style={styles.sectionContent}>
        QR toʻlov ishlab chiqarish xizmatidan foydalanish uchun sotuvchilardan oylik abonent toʻlovi olinishi mumkin. Obuna tafsilotlari, jumladan, narxlar sotuvchilar roʻyxatdan oʻtgandan soʻng ular bilan baham koʻriladi.
To'lovlar qaytarilmaydi, biz tomonimizdagi muammolar tufayli xizmat ko'rsatishda uzilishlar yuzaga kelgan hollar bundan mustasno.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>5. Ma'lumotlarning maxfiyligi</Text>
        <Text style={styles.sectionContent}>
        Biz Maxfiylik siyosatimizda tavsiflanganidek, foydalanuvchi ma'lumotlari, to'lov statistikasi va tranzaksiya ma'lumotlari kabi ma'lum ma'lumotlarni to'playmiz. Ushbu ilovadan foydalanish orqali foydalanuvchilar o'z ma'lumotlarini to'plash va ulardan foydalanishga rozilik bildiradilar.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>6. Mas'uliyatni cheklash</Text>
        <Text style={styles.sectionContent}>
        SBP QRPay sotuvchilar va xaridorlar o'rtasidagi ruxsatsiz bitimlar yoki kelishmovchiliklar uchun javobgar emas. Bizning rolimiz QR-ga asoslangan to'lovlar uchun platformani taqdim etish bilan cheklangan va tranzaksiyani amalga oshirishdagi har qanday xatolar ishtirokchilarning javobgarligidir.
Biz texnik nosozliklar, xizmat ko'rsatishdagi uzilishlar yoki ilovamizdan foydalanish natijasida yuzaga keladigan yo'qotishlar uchun javobgar emasmiz.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>7. Shartlarga o'zgartirishlar</Text>
        <Text style={styles.sectionContent}>
        Biz ushbu shartlarni istalgan vaqtda o'zgartirish huquqini saqlab qolamiz. O'zgartirishlar ilovada e'lon qilinadi va xizmatdan doimiy foydalanish yangi shartlarni qabul qilishni anglatadi.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>8. Amaldagi qonun</Text>
        <Text style={styles.sectionContent}>
          Ushbu Shartlar va shartlar O'zbekistan qonunlari bilan tartibga
          solinadi, uning qonun hujjatlari ziddiyatidan qat'i nazar.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  updated: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 16,
    lineHeight: 22,
  },
});

export default TermsAndConditions;
