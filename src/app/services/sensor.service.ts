import { Injectable } from '@angular/core';
import { Geolocation, Position } from '@capacitor/geolocation';
import { Motion } from '@capacitor/motion';
import { BehaviorSubject } from 'rxjs';
import { PluginListenerHandle } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics'; // Importa Haptics

@Injectable({
  providedIn: 'root',
})
export class SensorService {
  accelerationHandler: PluginListenerHandle | null = null;
  orientationHandler: PluginListenerHandle | null = null;
  gpsWatcher: string | null = null;

  private accelerometerDataSubject = new BehaviorSubject<{
    x: number;
    y: number;
    z: number;
  }>({ x: 0, y: 0, z: 0 });

  private orientationDataSubject = new BehaviorSubject<{
    alpha: number;
    beta: number;
    gamma: number;
  }>({ alpha: 0, beta: 0, gamma: 0 });

  private coordinatesSubject = new BehaviorSubject<Position | null>(null);

  constructor() {}

  async hapticsImpactMedium() {
    await Haptics.impact({ style: ImpactStyle.Medium });
  }

  async hapticsImpactLight() {
    await Haptics.impact({ style: ImpactStyle.Light });
  }

  async hapticsVibrate() {
    await Haptics.vibrate();
  }

  async hapticsSelectionStart() {
    await Haptics.impact({ style: ImpactStyle.Medium });
  }
  

  async hapticsSelectionChanged() {
    await Haptics.impact({ style: ImpactStyle.Medium });
  }
  async hapticsSelectionEnd() {
    await Haptics.impact({ style: ImpactStyle.Medium });
  }

  getCurrentCoordinates() {
    return this.coordinatesSubject.asObservable();
  }

  getAccelerometerData() {
    return this.accelerometerDataSubject.asObservable();
  }

  getOrientationData() {
    return this.orientationDataSubject.asObservable();
  }

  async startWatchingGPS() {
    this.gpsWatcher = await Geolocation.watchPosition({}, (position) => {
      if (position) {
        this.coordinatesSubject.next(position);
      }
    });
  }

  async startListeningToMotion() {
    this.accelerationHandler = await Motion.addListener('accel', (event) => {
      this.accelerometerDataSubject.next({
        x: event.acceleration.x,
        y: event.acceleration.y,
        z: event.acceleration.z,
      });
    });

    this.orientationHandler = await Motion.addListener('orientation', (event) => {
      this.orientationDataSubject.next({
        alpha: event.alpha,
        beta: event.beta,
        gamma: event.gamma,
      });
    });
  }

  async stopWatchingGPS() {
    if (this.gpsWatcher) {
      await Geolocation.clearWatch({ id: this.gpsWatcher });
      this.coordinatesSubject.next(null);
      this.gpsWatcher = null;
    }
  }
}