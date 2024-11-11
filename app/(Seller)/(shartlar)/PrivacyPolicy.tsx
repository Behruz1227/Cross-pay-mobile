// src/components/PrivacyPolicy.tsx
import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Text, View } from "react-native";

const PrivacyPolicy: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Maxfiylik siyosati</Text>
      <Text style={styles.updated}>Oxirgi yangilangan: 14.10.2024</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Umumiy ko‘rinish</Text>
        <Text style={styles.sectionContent}>
          SBP QRPay da biz sizning maxfiyligingizni himoya qilishga sodiqmiz.
          Ushbu Maxfiylik siyosati sizning ma'lumotlaringizni qanday
          yig'ishimiz, ishlatishimiz va saqlashimizni tushuntiradi.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Biz to'playdigan ma'lumotlar</Text>
        <Text style={styles.sectionContent}>
          Biz quyidagi turdagi ma'lumotlarni yig'amiz:
        </Text>
        <View style={styles.subSection}>
          <Text style={styles.bulletPoint}>
            • Kompaniya tafsilotlari: Kompaniya nomlari, soliq identifikatsiya
            raqamlari (INN) va sotuvchi bilan bog'lanish ma'lumotlari kabi
            ma'lumotlar.
          </Text>
          <Text style={styles.bulletPoint}>
            • Tranzaksiya ma'lumotlari: to'lov summalari, to'lov usullari va
            to'lov summalariga oid statistik ma'lumotlar.
          </Text>
          <Text style={styles.bulletPoint}>
            • Ilovadan foydalanish maʼlumotlari: Foydalanuvchilarning ilova
            bilan qanday aloqada boʻlishlari, jumladan login va QR yaratish
            faoliyati haqida maʼlumot.
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. Ma'lumotlarni almashish</Text>
        <Text style={styles.sectionContent}>
          Ha, biz sizning maʼlumotlaringizni toʻlovlarni qayta ishlash uchun
          foydalanayotgan Rossiya toʻlov tizimlari kabi uchinchi tomon xizmat
          koʻrsatuvchi provayderlari bilan baham koʻrishimiz mumkin. Ular
          o'zlarining ma'lumotlar maxfiyligi amaliyotiga ega va ma'lumotlar
          bazalarida to'lov bilan bog'liq ma'lumotlarni saqlash uchun
          javobgardirlar.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. Ma'lumotlarni saqlash</Text>
        <Text style={styles.sectionContent}>
          Biz to'plagan ma'lumotlar bizning xavfsiz ma'lumotlar bazalarimizda
          saqlanadi. Rossiya toʻlov tizimlari bilan baham koʻrilgan maʼlumotlar
          ham ularning tegishli xavfsiz tizimlarida saqlanadi. Biz barcha
          saqlash tizimlari ma'lumotlarni himoya qilish qoidalariga
          muvofiqligini va ruxsatsiz kirishdan himoyalanganligini ta'minlash
          uchun choralar ko'ramiz.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>5. Ma'lumotlar xavfsizligi</Text>
        <Text style={styles.sectionContent}>
          Ma'lumotlaringizni ruxsatsiz kirish yoki oshkor qilishdan himoya
          qilish uchun biz sanoat standartidagi shifrlash va kirishni boshqarish
          vositalaridan foydalanamiz. Barcha tranzaktsiyalar xavfsiz tarzda
          qayta ishlanadi va biz tizimimizni zaifliklar uchun doimiy ravishda
          kuzatib boramiz.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>6. Foydalanuvchi huquqlari</Text>
        <Text style={styles.sectionContent}>
          Foydalanuvchilar o'zlarining shaxsiy ma'lumotlariga kirishni talab
          qilish yoki ma'lumotlarini o'chirishni so'rash huquqiga ega. Bunday
          so'rovlar Sfera yechimlari orqali bizning qo'llab-quvvatlash
          guruhimizga yuborilishi kerak
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          7. Maxfiylik siyosatiga yangilanishlar
        </Text>
        <Text style={styles.sectionContent}>
          Bu siyosat vaqti-vaqti bilan yangilanishi mumkin. Biz
          foydalanuvchilarni har qanday muhim o'zgarishlar haqida xabardor
          qilamiz va yangilanishlardan keyin xizmatdan foydalanishni davom
          ettirish sizning qayta ko'rib chiqilgan siyosatni qabul qilganingizni
          anglatadi.
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
  subSection: {
    marginLeft: 10,
    marginTop: 10,
  },
  bulletPoint: {
    fontSize: 16,
    lineHeight: 22,
  },
});

export default PrivacyPolicy;
