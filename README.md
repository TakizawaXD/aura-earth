### Sistema de Inteligencia Empresarial y Monitoreo Global de KPIs

---

## **📌 Descripción General del Proyecto**

**Aura Global** es un sistema de Inteligencia Empresarial (Business Intelligence) diseñado para centralizar, analizar y visualizar datos provenientes de diferentes filiales de una empresa global. Su objetivo principal es consolidar indicadores de rendimiento (KPIs) en un solo panel, facilitando la toma de decisiones estratégicas en tiempo real.

El proyecto abarca análisis, planeación, diseño, desarrollo, pruebas y documentación completa del sistema, siguiendo estándares profesionales de ingeniería de software.

---

## **🎯 1. Título del Proyecto**

**Aura Global – Sistema de Inteligencia Empresarial y Monitoreo de KPIs Globales**

---

## **🧩 2. Problema y Justificación**

### **2.1 Problema**

En empresas multinacionales, los datos se encuentran dispersos entre diferentes sistemas, sedes y formatos. Esto genera:

* Falta de una vista consolidada del rendimiento global
* Dificultad para identificar desviaciones operacionales
* Decisiones tardías por ausencia de datos centralizados
* Imposibilidad de comparar filiales en tiempo real

### **2.2 Justificación**

**Aura Global** se plantea como solución técnica y estratégica porque:

* Centraliza información en un Data Warehouse
* Proporciona dashboards interactivos modernos
* Permite monitoreo inmediato de KPIs críticos
* Facilita el análisis por regiones, fechas y categorías
* Mejora la planeación empresarial y la toma de decisiones

---

## **🎯 3. Objetivos**

### **3.1 Objetivo General**

Diseñar y construir un sistema de BI que consolide, visualice y analice los indicadores operacionales globales de una empresa, facilitando la toma de decisiones estratégicas.

### **3.2 Objetivos Específicos**

* Identificar los requerimientos funcionales y no funcionales mediante técnicas profesionales de levantamiento.
* Diseñar casos de uso, diagramas UML y modelos de datos que representen la arquitectura del sistema.
* Construir la plataforma siguiendo una metodología ágil, con entregas incrementales y control de versiones.
* Implementar dashboards interactivos para visualizar KPIs de Ventas y Producción.
* Validar el sistema mediante pruebas funcionales y de usabilidad.

---

## **📦 4. Alcance del Proyecto**

### **Incluye**

* Dashboard web para Ventas Globales y KPIs de Producción
* Backend con API para consulta de datos
* Base analítica (Data Warehouse simulado)
* Roles de usuario: Administrador y Lector
* Filtros avanzados (región, país, fecha, producto)
* Alertas visuales para KPIs críticos

### **Excluye**

* Conectores ETL en tiempo real
* Integraciones directas con ERPs externos
* Módulos administrativos avanzados (CRUD de usuarios completo)

---

## **📑 5. Requerimientos del Sistema**

### **5.1 Requerimientos Funcionales**

1. Visualizar datos de Ventas por región, país y producto.
2. Permitir filtros de fecha, región y categoría.
3. Mostrar alertas cuando un KPI sea menor al 90% de la meta.
4. Iniciar sesión mediante autenticación segura.
5. Mostrar KPIs en gráficos interactivos.

### **5.2 Requerimientos No Funcionales**

* **Rendimiento:** Carga del dashboard ≤ 5 segundos.
* **Seguridad:** Autenticación mediante JWT y roles.
* **Escalabilidad:** Arquitectura de tres capas.
* **Usabilidad:** Interfaz responsive (web y tablets).
* **Disponibilidad:** API preparada para manejar concurrencia.

---

## **🏗️ 6. Diseño del Sistema**

### **6.1 Arquitectura Propuesta**

* **Frontend:** React o Vue
* **Backend:** FastAPI o Node.js
* **Base de Datos:** PostgreSQL o MongoDB
* **Arquitectura:** Tres capas (Presentación, Lógica, Datos)

### **6.2 Diagramas UML**

* Diagramas de casos de uso:

  * Ver Dashboard
  * Filtrar KPIs
  * Iniciar sesión
* Diagrama de clases/componentes:

  * AuthService
  * AnalyticsService
  * VisualizationModule
  * DataWarehouse

### **6.3 Modelo Entidad-Relación**

Incluye entidades principales como:

* Filial
* Región
* Indicadores
* KPI_Mensual
* Usuario
* Roles
* LogEventos

---

## **📆 7. Planificación del Desarrollo**

### **7.1 Metodología**

* Enfoque Ágil (Scrum)
* Sprints de 2 semanas
* Tablero de tareas en Trello o Asana

### **7.2 Cronograma Estimado**

| Fase       | Actividad                        | Tiempo    |
| ---------- | -------------------------------- | --------- |
| Planeación | Requerimientos + Arquitectura    | 1 semana  |
| Diseño     | Diagramas UML + MER + Mockups    | 1 semana  |
| Desarrollo | Frontend + Backend               | 2 semanas |
| Pruebas    | Funcionales, usabilidad y cierre | 1 semana  |

### **7.3 Roles**

* **Analista:** Requerimientos y diseño de datos
* **Desarrollador:** API + Dashboard
* **QA:** Pruebas funcionales y reporte de errores

---

## **🛠️ 8. Construcción y Pruebas**

### **8.1 Evidencia de Pantallas**

* Login
* Dashboard global
* Filtros regionales
* Alertas KPI

### **8.2 Evidencia de Base de Datos y Código**

* Estructura de tablas
* Script SQL o migraciones
* Endpoints principales del backend

### **8.3 Pruebas Realizadas**

* RF1, RF2, RF3 verificados
* Pruebas de rendimiento
* Pruebas de interfaz en móvil y tablet

---

## **📊 9. Resultados y Conclusiones**

* Se logró consolidar la información en un dashboard moderno.
* La arquitectura permite escalar a más módulos o regiones.
* El sistema facilita el análisis comparativo entre sedes globales.
* El uso de gráficos interactivos mejora la experiencia del usuario.

---

## **🚀 10. Recomendaciones Futuras**

* Agregar modelos de predicción mediante Machine Learning.
* Crear conectores ETL automáticos para datos en tiempo real.
* Incluir CRUD completo de usuarios y roles avanzados.
* Implementar un módulo de reportes descargables (PDF/Excel).


Solo dime **“quiero el README versión X”** y lo preparo.
