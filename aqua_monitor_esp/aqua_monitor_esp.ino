 // ===========================================================
// ===========  ENVÍO DE TEMPERATURA Y PH A SUPABASE  =======
// ===========================================================

#include <WiFi.h>
#include <HTTPClient.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <Arduino.h>
#include <ArduinoJson.h>
#include <time.h>

// ---------------- CONFIGURACIÓN ESP 32 ----------------
const char* codigoESP = "ESP_001"; 
bool validarCodigoESP();
int idAcuario = -1;  // <-- Guardará el id del acuario asociado al ESP

// ---------------- CONFIGURACIÓN WIFI ----------------
const char* ssid = "PEREZ_MESH";
const char* password = "3007069wpj";

// ---------------- CONFIGURACIÓN SUPABASE ----------------
String supabase_url = "https://atjbisxvrsjdgujtotnm.supabase.co/rest/v1/parametros";
String supabase_table_alertas = "https://atjbisxvrsjdgujtotnm.supabase.co/rest/v1/alertas";
String supabase_table_acuarios = "https://atjbisxvrsjdgujtotnm.supabase.co/rest/v1/acuarios";
String supabase_api_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0amJpc3h2cnNqZGd1anRvdG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1NDQzOTgsImV4cCI6MjA3MzEyMDM5OH0.cgfgfRWltl2ARqv0FnQUc1J_1EGCNuQzTici2VZhU_w";

// ---------------- LCD I2C ----------------
LiquidCrystal_I2C lcd(0x27, 16, 2);

// ---------------- SENSOR DE TEMPERATURA DS18B20 ----------------
const int oneWireBus = 4;
OneWire oneWire(oneWireBus);
DallasTemperature sensors(&oneWire);

// ---------------- SENSOR DE PH ----------------
const int phPin = 34; /// aquii
float voltage = 0.0;
float phValue = 0.0;

// ---------------- LED CONTROL ----------------
const int ledPin = 26;
bool estadoLuz = false;
bool programacionLuz = false;
int horaLuzInicio = 0;
int minutoLuzInicio = 0;
int segLuzInicio = 0;
int horaLuzFinal = 0;
int minutoLuzFinal = 0;
int segLuzFinal  = 0;

const int filtroPin = 27;
bool estadoFiltro = false;
bool programacionFiltro = false;

// ---------------- NOTIFICATIONS ----------------
bool enviadoNotTemp = false;
bool enviadoNotPh = false;
int minTemp = 0;
int maxTemp = 100;
int minPh = 0;
int maxPh = 100;

// ---------------- HOUR -----------------
const char* ntpServer = "pool.ntp.org";
const long gmtOffset_sec = -4 * 3600;   // Bolivia GMT-4
const int daylightOffset_sec = 0;

// ---------------- TIMING ----------------
unsigned long previousMillisSend = 0;
unsigned long previousMillisLed = 0;
const unsigned long sendInterval = 120000;  // 2 minutos
const unsigned long ledInterval = 15000;    // 15 segundos

// ===========================================================
// ===================== SETUP ==============================
// ===========================================================
void setup() {
  Serial.begin(115200);
  Wire.begin(21, 22);

  pinMode(ledPin, OUTPUT);
  pinMode(filtroPin, OUTPUT);

  digitalWrite(ledPin, HIGH);
  digitalWrite(filtroPin, HIGH);


  lcd.init();
  lcd.backlight();
  lcd.setCursor(0, 0);
  lcd.print("Conectando WiFi");

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\n✅ WiFi conectado");
  lcd.clear();
  lcd.print("WiFi conectado");
  delay(1000);

  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    lcd.clear();
    lcd.setCursor(0, 1);
    lcd.print("Error hora");
    return;
  }

  // ⚠️ VALIDAR CÓDIGO CON SUPABASE
  lcd.clear();
  lcd.setCursor(0, 1);
  lcd.print("Validando ESP");

  bool valido = validarCodigoESP();

 /*  if (!valido) {
    while (true) {
      delay(1000);   // queda detenido
    }
  } */

  lcd.clear();
  lcd.print("ESP validado!");
  sensors.begin();
}

// ===========================================================
// ===================== FUNCIONES ==========================
// ===========================================================

bool validarCodigoESP() {
  if (WiFi.status() != WL_CONNECTED) return false;

  HTTPClient http;
  String url = supabase_table_acuarios + "?id_central=eq." + String(codigoESP);
  http.begin(url);
  http.addHeader("apikey", supabase_api_key);
  http.addHeader("Authorization", "Bearer " + supabase_api_key);

  int httpCode = http.GET();

  if (httpCode > 0) {
    String payload = http.getString();
    Serial.println("Respuesta Supabase:");
    Serial.println(payload);

    DynamicJsonDocument doc(1024);
    DeserializationError error = deserializeJson(doc, payload);

    if (error) {
      Serial.println("❌ Error al parsear JSON");
      http.end();
      return false;
    }

    if (doc.size() == 0) {
      Serial.println("❌ Código ESP NO registrado en Supabase");
      http.end();
      lcd.clear();
      lcd.print(String("Codigo: ") + codigoESP);
      return false;
    }

    // Guardar el id del acuario asociado
    idAcuario = doc[0]["id"];
    estadoLuz = doc[0]["luz"];
    programacionLuz = doc[0]["luz_programada"];
    estadoFiltro = doc[0]["filtro"];
    programacionFiltro = doc[0]["filtro_programado"];
    minTemp = doc[0]["temp_min"];
    maxTemp = doc[0]["temp_max"];
    minPh = doc[0]["ph_min"];
    maxPh = doc[0]["ph_max"];

    String horaLuzInicioStr = doc[0]["luz_inicio"].as<String>();
    horaLuzInicio   = horaLuzInicioStr.substring(0, 2).toInt();
    minutoLuzInicio = horaLuzInicioStr.substring(3, 5).toInt();
    segLuzInicio = horaLuzInicio * 3600 + minutoLuzInicio * 60;

    String horaLuzFinalStr = doc[0]["luz_final"].as<String>();
    horaLuzFinal   = horaLuzFinalStr.substring(0, 2).toInt();
    minutoLuzFinal = horaLuzFinalStr.substring(3, 5).toInt();
    segLuzFinal  = horaLuzFinal  * 3600 + minutoLuzFinal  * 60;

    digitalWrite(ledPin, estadoLuz ? LOW : HIGH);
    digitalWrite(filtroPin, estadoFiltro ? LOW : HIGH);
    Serial.print("✅ Código ESP validado. idAcuario: ");
    Serial.println(idAcuario);

    http.end();
    return true;
  } else {
    Serial.print("❌ Error GET Supabase: ");
    Serial.println(httpCode);
    http.end();
    return false;
  }
}

void sincronizarDatosMinimosMaximos() {
  if (WiFi.status() != WL_CONNECTED) return;

  HTTPClient http;
  String url = supabase_table_acuarios + "?id=eq." + String(idAcuario);
  http.begin(url);
  http.addHeader("apikey", supabase_api_key);
  http.addHeader("Authorization", "Bearer " + supabase_api_key);

  int httpCode = http.GET();

  if (httpCode > 0) {
    String payload = http.getString();
    Serial.println("Respuesta Supabase:");
    Serial.println(payload);

    DynamicJsonDocument doc(1024);
    DeserializationError error = deserializeJson(doc, payload);

    if (error) {
      Serial.println("❌ Error al actualizar valores mínimos y máximos.");
      http.end();
      return;
    }

    minTemp = doc[0]["temp_min"];
    maxTemp = doc[0]["temp_max"];
    minPh = doc[0]["ph_min"];
    maxPh = doc[0]["ph_max"];

    Serial.print("✅ Válores mínimos y máximos actualizados.");
    http.end();
  } else {
    Serial.println("❌ Error al actualizar valores mínimos y máximos.");
    http.end();
  }
}

void enviarDatosSupabase(float tempC, float phValue) {
  if (WiFi.status() != WL_CONNECTED) return;

  // ENVIAR PARAMETROS AL SUPABASE
  HTTPClient http_parametros;

  http_parametros.begin(supabase_url);
  http_parametros.addHeader("Content-Type", "application/json");
  http_parametros.addHeader("apikey", supabase_api_key);
  http_parametros.addHeader("Authorization", "Bearer " + supabase_api_key);
  http_parametros.addHeader("Prefer", "return=minimal");

  // Enviar temperatura
  String jsonTemp = "{\"id_acuario\": " + String(idAcuario) + ", \"tipo\": \"Temperatura\", \"valor\": " + String(tempC, 2) + "}";
  http_parametros.POST(jsonTemp);

  // Enviar pH
  String jsonPh = "{\"id_acuario\": " + String(idAcuario) + ", \"tipo\": \"PH\", \"valor\": " + String(phValue, 2) + "}";
  http_parametros.POST(jsonPh);

  http_parametros.end();

  // ENVIAR ALERTAS AL SUPABASE
  HTTPClient http_alertas;

  http_alertas.begin(supabase_table_alertas);
  http_alertas.addHeader("Content-Type", "application/json");
  http_alertas.addHeader("apikey", supabase_api_key);
  http_alertas.addHeader("Authorization", "Bearer " + supabase_api_key);
  http_alertas.addHeader("Prefer", "return=minimal");

  // alertas de temperatura
  if (tempC <= minTemp && !enviadoNotTemp && tempC != -127) {
    String jsonStr = "{\"id_acuario\": " + String(idAcuario) + ", \"titulo\": \"Alerta de temperatura\", \"descripcion\": \"Temperatura mínima fuera de rango: " + String(tempC, 2) + " < " + String(minTemp) + "\"}";
    http_alertas.POST(jsonStr);
    enviadoNotTemp = true;
  }
  if (tempC >= maxTemp && !enviadoNotTemp) {
    String jsonStr = "{\"id_acuario\": " + String(idAcuario) + ", \"titulo\": \"Alerta de temperatura\", \"descripcion\": \"Temperatura máxima fuera de rango: " + String(tempC, 2) + " > " + String(maxTemp) + "\"}";
    http_alertas.POST(jsonStr);
    enviadoNotTemp = true;
  }
  if (tempC > minTemp && tempC < maxTemp) {
    enviadoNotTemp = false;
  }

  // alertas de ph
  if (phValue <= minPh && !enviadoNotPh) {
    String jsonStr = "{\"id_acuario\": " + String(idAcuario) + ", \"titulo\": \"Alerta de pH\", \"descripcion\": \"pH mínimo fuera de rango: " + String(phValue, 2) + " < " + String(minPh) + "\"}";
    http_alertas.POST(jsonStr);
    enviadoNotPh = true;
  }
  if (phValue >= maxPh && !enviadoNotPh) {
    String jsonStr = "{\"id_acuario\": " + String(idAcuario) + ", \"titulo\": \"Alerta de pH\", \"descripcion\": \"pH máximo fuera de rango: " + String(phValue, 2) + " > " + String(maxPh) + "\"}";
    http_alertas.POST(jsonStr);
    enviadoNotPh = true;
  }
  if (phValue > minPh && phValue < maxPh) {
    enviadoNotPh = false;
  }

  http_alertas.end();

  Serial.println("✅ Datos enviados a Supabase.");
  lcd.clear();
  lcd.print("Datos enviados!");
}

void leerEstadoLuz() {
  if (WiFi.status() != WL_CONNECTED) return;

  if (idAcuario < 0) return; // Asegurarse que hay un id válido

  HTTPClient http;
  String url = supabase_table_acuarios + "?id=eq." + String(idAcuario);
  http.begin(url);
  http.addHeader("apikey", supabase_api_key);
  http.addHeader("Authorization", "Bearer " + supabase_api_key);

  int httpCode = http.GET();

  if (httpCode > 0) {
    String payload = http.getString();

    DynamicJsonDocument doc(1024);
    DeserializationError error = deserializeJson(doc, payload);

    programacionLuz = doc[0]["luz_programada"];

    String horaLuzInicioStr = doc[0]["luz_inicio"].as<String>();
    horaLuzInicio   = horaLuzInicioStr.substring(0, 2).toInt();
    minutoLuzInicio = horaLuzInicioStr.substring(3, 5).toInt();
    segLuzInicio = horaLuzInicio * 3600 + minutoLuzInicio * 60;

    String horaLuzFinalStr = doc[0]["luz_final"].as<String>();
    horaLuzFinal   = horaLuzFinalStr.substring(0, 2).toInt();
    minutoLuzFinal = horaLuzFinalStr.substring(3, 5).toInt();
    segLuzFinal  = horaLuzFinal  * 3600 + minutoLuzFinal  * 60;

    bool nuevoEstadoLed = doc[0]["luz"];
    estadoLuz = nuevoEstadoLed;
    if (!programacionLuz) {
      digitalWrite(ledPin, nuevoEstadoLed ? LOW : HIGH);
      Serial.print("💡 Luz: ");
      Serial.println(nuevoEstadoLed ? "ENCENDIDA" : "APAGADA");
    } else {
      if (nuevoEstadoLed) {
        Serial.println("💡 Luz programada de " + horaLuzInicioStr + " a " + horaLuzFinalStr);
      } else {
        digitalWrite(ledPin, HIGH);
        Serial.println("💡 Luz: APAGADA");
      }
    }

    programacionFiltro = doc[0]["filtro_programado"];
    if (!programacionFiltro) {
      bool nuevoEstadoFiltro = doc[0]["filtro"];
      estadoFiltro = nuevoEstadoFiltro;
      digitalWrite(filtroPin, nuevoEstadoFiltro ? LOW : HIGH);
      Serial.print("💧 Filtro: ");
      Serial.println(nuevoEstadoFiltro ? "ENCENDIDO" : "APAGADO");
    }
  } else {
    Serial.print("❌ Error al obtener estado del acuario: ");
    Serial.println(httpCode);
  }

  http.end();
}

void controlarDispositivosProgramados() {
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) return;

  int ahoraSeg =  timeinfo.tm_hour * 3600 +
                  timeinfo.tm_min  * 60 +
                  timeinfo.tm_sec;

  if (programacionLuz) {
    bool luzDebeEstarEncendida;

    if (segLuzInicio < segLuzFinal) {
      luzDebeEstarEncendida = (ahoraSeg >= segLuzInicio && ahoraSeg < segLuzFinal);
    } else {
      luzDebeEstarEncendida = (ahoraSeg >= segLuzInicio || ahoraSeg < segLuzFinal);
    }
    if (!estadoLuz) {
      luzDebeEstarEncendida = false;
    }

    digitalWrite(ledPin, luzDebeEstarEncendida ? LOW : HIGH);
  }
}

// ===========================================================
// ===================== LOOP ===============================
// ===========================================================
void loop() {
  unsigned long currentMillis = millis();

  // ===== Leer sensores continuamente =====
  sensors.requestTemperatures();
  float tempC = sensors.getTempCByIndex(0);

  int sensorValue = analogRead(phPin);
  voltage = sensorValue * (3.3 / 4095.0);
  phValue = 7 + ((2.5 - voltage) / 0.18);

  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("T:");
  lcd.print(tempC, 1);
  lcd.print(" C");
  lcd.setCursor(0, 1);
  lcd.print("Ph: ");
  lcd.print(phValue, 1);

  // ===== Sincronizar datos cada 2 min =====
  Serial.print("🕛 Sincronizando datos en: ");
  Serial.println((currentMillis - previousMillisSend) / 1000);
  if (currentMillis - previousMillisSend >= sendInterval) {
    previousMillisSend = currentMillis;
    sincronizarDatosMinimosMaximos();
    enviarDatosSupabase(tempC, phValue);
  } 

  // ===== Leer estado del LED cada 15 seg =====
  Serial.print("🕛 Sincronizando acuario en: ");
  Serial.println((currentMillis - previousMillisLed) / 1000);
  if (currentMillis - previousMillisLed >= ledInterval) {
    previousMillisLed = currentMillis;
    leerEstadoLuz();
  }

  delay(1000);
}
