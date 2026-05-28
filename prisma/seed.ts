import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });


async function main() {
  console.log("🌱 Seeding database...");

  // Admin user
  const hashedPassword = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: hashedPassword,
      name: "مدير النظام",
      role: "admin",
    },
  });
  console.log("✅ User created: admin / admin123");

  // Specialties
  const specialties = [
    { name: "Cardiology", nameAr: "أمراض القلب", description: "Heart and cardiovascular system", descriptionAr: "أمراض القلب والجهاز الدوري" },
    { name: "Neurology", nameAr: "أمراض الأعصاب", description: "Brain and nervous system", descriptionAr: "الدماغ والجهاز العصبي" },
    { name: "Orthopedics", nameAr: "العظام والمفاصل", description: "Bones, joints and muscles", descriptionAr: "العظام والمفاصل والعضلات" },
    { name: "Pediatrics", nameAr: "طب الأطفال", description: "Medical care for children", descriptionAr: "الرعاية الطبية للأطفال" },
    { name: "Dermatology", nameAr: "الجلدية", description: "Skin, hair and nails", descriptionAr: "الجلد والشعر والأظافر" },
    { name: "Ophthalmology", nameAr: "طب العيون", description: "Eye care and vision", descriptionAr: "رعاية العيون والبصر" },
    { name: "General Medicine", nameAr: "الطب العام", description: "General medical practice", descriptionAr: "الممارسة الطبية العامة" },
  ];

  const createdSpecialties: Record<string, string> = {};
  for (const spec of specialties) {
    const s = await prisma.specialty.upsert({
      where: { id: spec.name.toLowerCase().replace(/\s+/g, "-") },
      update: {},
      create: { id: spec.name.toLowerCase().replace(/\s+/g, "-"), ...spec },
    });
    createdSpecialties[spec.name] = s.id;
  }
  console.log("✅ Specialties created");

  // Doctors
  const doctors = [
    { name: "Dr. Ahmad Al-Rashid", nameAr: "د. أحمد الراشد", specialtyName: "Cardiology", phone: "+966501234567", email: "ahmad@clinic.com", experienceYears: 15, consultationFee: 200, workingDays: "sat-thu", workingHoursStart: "08:00", workingHoursEnd: "16:00" },
    { name: "Dr. Sara Al-Mansouri", nameAr: "د. سارة المنصوري", specialtyName: "Neurology", phone: "+966502234567", email: "sara@clinic.com", experienceYears: 10, consultationFee: 250, workingDays: "sat-thu", workingHoursStart: "09:00", workingHoursEnd: "17:00" },
    { name: "Dr. Khalid Bin Saleh", nameAr: "د. خالد بن صالح", specialtyName: "Orthopedics", phone: "+966503234567", email: "khalid@clinic.com", experienceYears: 12, consultationFee: 220, workingDays: "sat-thu", workingHoursStart: "08:00", workingHoursEnd: "15:00" },
    { name: "Dr. Fatima Al-Zahra", nameAr: "د. فاطمة الزهراء", specialtyName: "Pediatrics", phone: "+966504234567", email: "fatima@clinic.com", experienceYears: 8, consultationFee: 180, workingDays: "sun-thu", workingHoursStart: "10:00", workingHoursEnd: "18:00" },
    { name: "Dr. Omar Hassan", nameAr: "د. عمر حسن", specialtyName: "General Medicine", phone: "+966505234567", email: "omar@clinic.com", experienceYears: 6, consultationFee: 150, workingDays: "sat-thu", workingHoursStart: "08:00", workingHoursEnd: "16:00" },
  ];

  const createdDoctors: Record<string, string> = {};
  for (const doc of doctors) {
    const d = await prisma.doctor.create({
      data: {
        name: doc.name,
        nameAr: doc.nameAr,
        specialtyId: createdSpecialties[doc.specialtyName],
        phone: doc.phone,
        email: doc.email,
        experienceYears: doc.experienceYears,
        consultationFee: doc.consultationFee,
        workingDays: doc.workingDays,
        workingHoursStart: doc.workingHoursStart,
        workingHoursEnd: doc.workingHoursEnd,
      },
    });
    createdDoctors[doc.name] = d.id;
  }
  console.log("✅ Doctors created");

  // Patients
  const patients = [
    { name: "Mohammed Al-Ghamdi", nameAr: "محمد الغامدي", gender: "male", phone: "+966511111111", dateOfBirth: new Date("1985-03-15"), bloodType: "A+", nationalId: "1234567890" },
    { name: "Nora Al-Otaibi", nameAr: "نورة العتيبي", gender: "female", phone: "+966522222222", dateOfBirth: new Date("1990-07-22"), bloodType: "B+", nationalId: "1234567891" },
    { name: "Abdullah Al-Qahtani", nameAr: "عبدالله القحطاني", gender: "male", phone: "+966533333333", dateOfBirth: new Date("1978-11-05"), bloodType: "O+", nationalId: "1234567892" },
    { name: "Hessa Al-Shammari", nameAr: "حصة الشمري", gender: "female", phone: "+966544444444", dateOfBirth: new Date("1995-01-30"), bloodType: "AB+", nationalId: "1234567893" },
    { name: "Faisal Al-Dosari", nameAr: "فيصل الدوسري", gender: "male", phone: "+966555555555", dateOfBirth: new Date("1982-08-18"), bloodType: "A-", nationalId: "1234567894" },
    { name: "Maryam Al-Harbi", nameAr: "مريم الحربي", gender: "female", phone: "+966566666666", dateOfBirth: new Date("1988-05-12"), bloodType: "B-", nationalId: "1234567895" },
    { name: "Saleh Al-Mutairi", nameAr: "صالح المطيري", gender: "male", phone: "+966577777777", dateOfBirth: new Date("1970-09-25"), bloodType: "O-", nationalId: "1234567896" },
    { name: "Reem Al-Zahrani", nameAr: "ريم الزهراني", gender: "female", phone: "+966588888888", dateOfBirth: new Date("1993-12-08"), bloodType: "A+", nationalId: "1234567897" },
  ];

  const createdPatients: string[] = [];
  let patNum = 1001;
  for (const pat of patients) {
    const p = await prisma.patient.create({
      data: {
        ...pat,
        patientNumber: `P-${patNum++}`,
      },
    });
    createdPatients.push(p.id);
  }
  console.log("✅ Patients created");

  // Appointments
  const now = new Date();
  const appointments = [
    {
      patientId: createdPatients[0],
      doctorId: createdDoctors["Dr. Ahmad Al-Rashid"],
      date: new Date(now.getTime() + 2 * 60 * 60 * 1000),
      type: "consultation",
      status: "confirmed",
      reason: "Chest pain follow-up",
    },
    {
      patientId: createdPatients[1],
      doctorId: createdDoctors["Dr. Sara Al-Mansouri"],
      date: new Date(now.getTime() + 4 * 60 * 60 * 1000),
      type: "followUp",
      status: "scheduled",
      reason: "Migraine treatment",
    },
    {
      patientId: createdPatients[2],
      doctorId: createdDoctors["Dr. Khalid Bin Saleh"],
      date: new Date(now.getTime() + 24 * 60 * 60 * 1000),
      type: "consultation",
      status: "scheduled",
      reason: "Knee pain",
    },
    {
      patientId: createdPatients[3],
      doctorId: createdDoctors["Dr. Fatima Al-Zahra"],
      date: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      type: "followUp",
      status: "completed",
      reason: "Routine checkup",
    },
    {
      patientId: createdPatients[4],
      doctorId: createdDoctors["Dr. Omar Hassan"],
      date: new Date(now.getTime() + 48 * 60 * 60 * 1000),
      type: "consultation",
      status: "scheduled",
      reason: "Annual checkup",
    },
    {
      patientId: createdPatients[5],
      doctorId: createdDoctors["Dr. Ahmad Al-Rashid"],
      date: new Date(now.getTime() + 72 * 60 * 60 * 1000),
      type: "procedure",
      status: "confirmed",
      reason: "ECG Test",
    },
    {
      patientId: createdPatients[6],
      doctorId: createdDoctors["Dr. Omar Hassan"],
      date: new Date(now.getTime() - 24 * 60 * 60 * 1000),
      type: "consultation",
      status: "completed",
      reason: "Fever and cold",
    },
    {
      patientId: createdPatients[7],
      doctorId: createdDoctors["Dr. Sara Al-Mansouri"],
      date: new Date(now.getTime() - 48 * 60 * 60 * 1000),
      type: "consultation",
      status: "cancelled",
      reason: "Dizziness",
    },
  ];

  let aptNum = 1001;
  for (const apt of appointments) {
    await prisma.appointment.create({
      data: {
        ...apt,
        appointmentNumber: `APT-${aptNum++}`,
        duration: 30,
      },
    });
  }
  console.log("✅ Appointments created");

  console.log("\n🎉 Database seeded successfully!");
  console.log("   Login: admin / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
