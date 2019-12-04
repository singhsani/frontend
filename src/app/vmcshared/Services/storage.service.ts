import { Injectable } from "@angular/core";


@Injectable({
    providedIn: 'root'
})

export class StorageService {

    setItem(key: string, value: string, isObject: boolean = false) {
        if (isObject) {
            localStorage.setItem(key, JSON.stringify(value));
        }
        else {
            localStorage.setItem(key, value);
        }
    }

    getItem(key: string, isObject: boolean = false) {
        if (isObject) {
            return JSON.parse(localStorage.getItem(key));
        }
        else {
            return localStorage.getItem(key);
        }
    }

    removeItem(key: string) {
        localStorage.removeItem(key);
    }

    setPropertyModel(data) {
        this.setItem('propertyModel', data, true);
    }

    getPropertyModel() {
        return this.getItem('propertyModel',true);
    }

}