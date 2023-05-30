import biology from '../assets/subjects/biology.png';
import algorithms from '../assets/subjects/algorithms.png';
import blockchain from '../assets/subjects/blockchain.png';
import car from '../assets/subjects/car.png';
import chemistry from '../assets/subjects/chemistry.png';
import computer from '../assets/subjects/computer.png';
import crane from '../assets/subjects/crane.png';
import sec from '../assets/subjects/cyber-security.png';
import economic from '../assets/subjects/economic.png';
import education from '../assets/subjects/education.png';
import energySystem from '../assets/subjects/energy-system.png';
import eng from '../assets/subjects/eng.png';
import engineer from '../assets/subjects/engineer.png';
import finance from '../assets/subjects/finance.png';
import hust from '../assets/subjects/hust.png';
import IOT from '../assets/subjects/internet-of-things.png';
import literature from '../assets/subjects/literature.png';
import manager from '../assets/subjects/manager.png';
import math from '../assets/subjects/math.png';
import medical from '../assets/subjects/medical.png';
import medicine from '../assets/subjects/medicine.png';
import meeting from '../assets/subjects/meeting.png';
import microchip from '../assets/subjects/microchip.png';
import nodejs from '../assets/subjects/nodejs.png';
import physics from '../assets/subjects/physics.png';
import position from '../assets/subjects/position.png';
import react from '../assets/subjects/react.png';
import science from '../assets/subjects/science.png';
import software from '../assets/subjects/software.png';
import suture from '../assets/subjects/suture.png';
import technology from '../assets/subjects/technology.png';

export const collapseString = (str: string, maxLength: number, lengthShow: number) => {
    let strCollapse = str;
    if (str.length > maxLength) {
        strCollapse = str.slice(0, lengthShow) + '...';
    }
    return strCollapse;
};

export const getSrcAvatarRoom = (avatar: string) => {
    switch (avatar) {
        case "algorithms": {
            return algorithms;
            break;
        }

        case "biology": {
            return biology;
            break;
        }

        case "blockchain": {
            return blockchain;
            break;
        }

        case "car": {
            return car;
            break;
        }

        case "chemistry": {
            return chemistry;
            break;
        }

        case "computer": {
            return computer;
            break;
        }

        case "crane": {
            return crane;
            break;
        }

        case "sec": {
            return sec;
            break;
        }

        case "economic": {
            return economic;
            break;
        }

        case "education": {
            return education;
            break;
        }

        case "energySystem": {
            return energySystem;
            break;
        }

        case "eng": {
            return eng;
            break;
        }

        case "engineer": {
            return engineer;
            break;
        }

        case "finance": {
            return finance;
            break;
        }

        case "hust": {
            return hust;
            break;
        }

        case "iot": {
            return IOT;
            break;
        }

        case "literature": {
            return literature;
            break;
        }

        case "manager": {
            return manager;
            break;
        }

        case "math": {
            return math;
            break;
        }

        case "medical": {
            return medical;
            break;
        }

        case "medicine": {
            return medicine;
            break;
        }

        case "meeting": {
            return meeting;
            break;
        }

        case "microchip": {
            return microchip;
            break;
        }

        case "nodejs": {
            return nodejs;
            break;
        }

        case "physics": {
            return physics;
            break;
        }

        case "position": {
            return position;
            break;
        }

        case "react": {
            return react;
            break;
        }

        case "science": {
            return science;
            break;
        }

        case "software": {
            return software;
            break;
        }

        case "suture": {
            return suture;
            break;
        }

        case "technology": {
            return technology;
            break;
        }

        default: {
            return ''
        }
    }
}



export {}