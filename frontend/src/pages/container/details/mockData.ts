import containerImg1 from '../../../assets/container.png';
import containerImg2 from '../../../assets/container.png';
import containerImg3 from '../../../assets/container.png';
import containerImg4 from '../../../assets/container.png';

// Типи даних
export interface Container {
    id: number;
    title: string;
    price: number;
    currency: string;
    image?: string;
    images?: string[];
    condition?: string;
    location?: string;
    type?: string;
    colors?: string[];
    specifications?: {
        size: "10ft";
        door: "Roll-Up";
        status: "used";
        clicks: number;
        saves: number;
    };
    specs?: string[];
}

// Дані основного контейнера
export const containerData: Container = {
    id: 1,
    title: "10ft New High Cube Storage Container with Roll-Up Door",
    price: 2500,
    currency: "USD",
    images: [
        containerImg1,
        containerImg2,
        containerImg3,
        containerImg4
    ],
    condition: "used",
    location: "Odesa, Ukraine",
    type: "Вантажний",
    colors: ["#204F73", "#4A4F73", "#524F73", "#694F73", "#524F21", "#4A4F21", "#4A4F73"],
    specifications: {
        size: "10ft",
        door: "Roll-Up",
        status: "used",
        clicks: 54,
        saves: 13
    }
};

// Рекомендовані контейнери
export const recommendedContainers: Container[] = [
    {
        id: 2,
        title: "40ft High Cube",
        price: 2500,
        currency: "USD",
        image: containerImg1,
        specs: ["#204F73", "#4A4F73", "#524F73", "#694F73"]
    },
    {
        id: 3,
        title: "40ft High Cube",
        price: 2500,
        currency: "USD",
        image: containerImg1,
        specs: ["#204F73", "#4A4F73", "#524F73", "#694F73"]
    },
    {
        id: 4,
        title: "40ft High Cube",
        price: 2500,
        currency: "USD",
        image: containerImg1,
        specs: ["#204F73", "#4A4F73", "#524F73", "#694F73"]
    },
    {
        id: 5,
        title: "40ft High Cube",
        price: 2500,
        currency: "USD",
        image: containerImg1,
        specs: ["#204F73", "#4A4F73", "#524F73", "#694F73"]
    }
];