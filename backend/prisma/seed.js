const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding dummy hospitals and doctors...");

  // Create Hospitals
  const hospitalA = await prisma.hospital.create({
    data: {
      name: "Apollo City Hospital",
      location: "Bangalore Central",
      rating: 4.8,
      doctors: {
        create: [
          { name: "Dr. A. Sharma", specialty: "Cardiologist" },
          { name: "Dr. R. Gupta", specialty: "Neurologist" },
          { name: "Dr. S. Patil", specialty: "General Physician" }
        ]
      }
    }
  });

  const hospitalB = await prisma.hospital.create({
    data: {
      name: "Fortis Healthcare",
      location: "Whitefield",
      rating: 4.5,
      doctors: {
        create: [
          { name: "Dr. K. Iyer", specialty: "Orthopedics" },
          { name: "Dr. M. Singh", specialty: "Pediatrics" }
        ]
      }
    }
  });

  const hospitalC = await prisma.hospital.create({
    data: {
      name: "Manipal Hospital",
      location: "Indiranagar",
      rating: 4.7,
      doctors: {
        create: [
          { name: "Dr. V. Reddy", specialty: "Dermatologist" },
          { name: "Dr. N. Kumar", specialty: "Psychiatrist" },
          { name: "Dr. L. Das", specialty: "General Physician" }
        ]
      }
    }
  });

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
