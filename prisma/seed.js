// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Начинаем заполнение базы данных...');

  // Очищаем существующие данные
  await prisma.favorite.deleteMany();
  await prisma.order.deleteMany();
  await prisma.door.deleteMany();

  // Создаем двери
  const doors = await prisma.door.createMany({
    data: [
      {
        name: "Дверь межкомнатная 'Милан'",
        price: 12500,
        material: "Массив сосны",
        size: "2000x800 мм",
        color: "Белый",
        image: "/doors/door1.jpg",
        description: "Элегантная межкомнатная дверь из массива сосны с современным дизайном"
      },
      {
        name: "Дверь входная 'Форт'",
        price: 23400,
        material: "Сталь",
        size: "2050x900 мм",
        color: "Короичневый",
        image: "/doors/door2.jpg",
        description: "Надежная стальная входная дверь с усиленной конструкцией"
      },
      {
        name: "Дверь межкомнатная 'Венеция'",
        price: 15600,
        material: "МДФ",
        size: "2000x700 мм",
        color: "Венге",
        image: "/doors/door3.jpg",
        description: "Стильная дверь из МДФ с покрытием под венге"
      },
      {
        name: "Дверь раздвижная 'Гармония'",
        price: 18900,
        material: "Стекло + алюминий",
        size: "2200x900 мм",
        color: "Хром",
        image: "/doors/door4.jpg",
        description: "Современная раздвижная система с матовым стеклом"
      },
      {
        name: "Дверь межкомнатная 'Классик'",
        price: 14200,
        material: "Массив дуба",
        size: "2000x800 мм",
        color: "Дуб",
        image: "/doors/door5.jpg",
        description: "Классическая дверь из массива дуба с филенчатым дизайном"
      },
      {
        name: "Дверь входная 'Профи'",
        price: 28700,
        material: "Сталь 2мм",
        size: "2050x860 мм",
        color: "Серый металлик",
        image: "/doors/door6.jpg",
        description: "Профессиональная входная дверь с терморазрывом"
      }
    ]
  });

  console.log('База данных успешно заполнена!');
  console.log(`Создано 6 дверей`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });