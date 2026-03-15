import { HardwareType } from "@/lib/types";

/** Wattage (Watts) per hardware unit at full utilization */
export const HARDWARE_WATT: Record<HardwareType, number> = {
  cpu: 240,
  "gpu-t4": 70,
  "gpu-v100": 300,
  "gpu-a100": 400,
  "tpu-v4": 170,
};

/** Industry-average Power Usage Effectiveness */
export const PUE = 1.12;

/** Normalization ceiling for carbon intensity scoring (gCO₂/kWh) */
export const MAX_CARBON_INTENSITY = 500;

/** Normalization ceiling for hourly GPU price (USD) */
export const MAX_GPU_PRICE_PER_HOUR = 5.0;

/** Normalization ceiling for hourly CPU price (USD) */
export const MAX_CPU_PRICE_PER_HOUR = 0.1;
