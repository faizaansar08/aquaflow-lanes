# 🔧 AquaFlow Lanes - Backend Documentation

## Backend Overview

The backend system for AquaFlow Lanes includes IoT sensors, data management, and real-time monitoring capabilities. This document outlines the backend architecture and integration points.

---

## 🏗️ Backend Architecture

### System Components

```
┌─────────────────────────────────────────────┐
│         IoT SENSOR NETWORK                  │
│  (Water Quality, Flow, Temperature, Air)    │
└────────────────┬────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────┐
│      DATA COLLECTION LAYER                  │
│  (Data Aggregation & Preprocessing)         │
└────────────────┬────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────┐
│      API GATEWAY & MIDDLEWARE               │
│  (REST API, Authentication, Rate Limiting)  │
└────────────────┬────────────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
        ↓                 ↓
┌──────────────┐  ┌──────────────┐
│ DATABASE     │  │ CACHE        │
│ (TimeSeries) │  │ (Real-time)  │
└──────────────┘  └──────────────┘
        │                 │
        └────────┬────────┘
                 │
                 ↓
┌─────────────────────────────────────────────┐
│      ANALYTICS & ALERTS                     │
│  (Real-time Processing, Notifications)      │
└────────────────┬────────────────────────────┘
                 │
        ┌────────┴─────────┐
        │                  │
        ↓                  ↓
┌──────────────┐  ┌──────────────┐
│ FRONTEND API │  │ MOBILE APP   │
│ (Dashboard)  │  │ (Alerts)     │
└──────────────┘  └──────────────┘
```

---

## 📡 IoT Sensor Suite

### 1. **Water Quality Sensors**

```json
{
  "sensor_id": "WQ_001",
  "location": "Bioswale_01",
  "parameters": {
    "pH": { "range": "6.5-8.5", "unit": "pH" },
    "TDS": { "range": "0-2000", "unit": "ppm" },
    "Turbidity": { "range": "0-1000", "unit": "NTU" },
    "Dissolved Oxygen": { "range": "0-20", "unit": "mg/L" }
  },
  "sampling_interval": "15 minutes"
}
```

### 2. **Flow Rate Sensors**

```json
{
  "sensor_id": "FR_001",
  "location": "Bioswale_inlet",
  "measurement": {
    "range": "0-1000",
    "unit": "liters/minute",
    "accuracy": "±2%"
  },
  "sampling_interval": "5 minutes"
}
```

### 3. **Temperature Sensors**

```json
{
  "sensor_id": "TEMP_001",
  "location": "Road_surface",
  "measurement": {
    "range": "-10 to +60",
    "unit": "°C",
    "accuracy": "±0.5°C"
  },
  "sampling_interval": "1 minute"
}
```

### 4. **Soil Moisture Sensors**

```json
{
  "sensor_id": "SM_001",
  "location": "Median_plants",
  "measurement": {
    "range": "0-100",
    "unit": "%",
    "accuracy": "±3%"
  },
  "sampling_interval": "30 minutes"
}
```

### 5. **Air Quality Sensors**

```json
{
  "sensor_id": "AQ_001",
  "location": "Road_center",
  "parameters": {
    "PM2.5": { "unit": "µg/m³" },
    "PM10": { "unit": "µg/m³" },
    "NO2": { "unit": "ppb" },
    "CO": { "unit": "ppm" }
  },
  "sampling_interval": "10 minutes"
}
```

---

## 📊 Data Collection & Storage

### Data Format

```json
{
  "timestamp": "2026-02-17T14:30:00Z",
  "sensor_id": "WQ_001",
  "readings": {
    "pH": 7.2,
    "TDS": 450,
    "turbidity": 12.5,
    "dissolved_oxygen": 8.5
  },
  "location": {
    "latitude": 12.9352,
    "longitude": 77.6245
  },
  "quality_flag": "GOOD"
}
```

### Database Schema

**Sensors Table**
```sql
CREATE TABLE sensors (
  id INT PRIMARY KEY,
  sensor_id VARCHAR(50) UNIQUE,
  sensor_type VARCHAR(50),
  location VARCHAR(100),
  coordinates POINT,
  installed_date TIMESTAMP,
  status VARCHAR(20),
  created_at TIMESTAMP
);
```

**Readings Table**
```sql
CREATE TABLE readings (
  id BIGINT PRIMARY KEY,
  sensor_id VARCHAR(50) FOREIGN KEY,
  reading_time TIMESTAMP,
  value FLOAT,
  unit VARCHAR(20),
  quality_flag VARCHAR(20),
  created_at TIMESTAMP,
  INDEX idx_sensor_time (sensor_id, reading_time)
);
```

**Alerts Table**
```sql
CREATE TABLE alerts (
  id INT PRIMARY KEY,
  sensor_id VARCHAR(50),
  alert_type VARCHAR(50),
  threshold_value FLOAT,
  current_value FLOAT,
  severity VARCHAR(20),
  message TEXT,
  acknowledged BOOLEAN,
  created_at TIMESTAMP,
  resolved_at TIMESTAMP
);
```

---

## 🔌 API Endpoints

### Authentication
```
POST /api/v1/auth/login
POST /api/v1/auth/logout
POST /api/v1/auth/refresh
```

### Sensor Data
```
GET /api/v1/sensors
GET /api/v1/sensors/{id}
GET /api/v1/readings?sensor_id={id}&start={timestamp}&end={timestamp}
POST /api/v1/readings (receive sensor data)
```

### Alerts
```
GET /api/v1/alerts
GET /api/v1/alerts/{id}
POST /api/v1/alerts/acknowledge
```

### Analytics
```
GET /api/v1/analytics/daily-summary
GET /api/v1/analytics/water-quality
GET /api/v1/analytics/temperature-trend
GET /api/v1/analytics/traffic-impact
```

---

## 📱 API Response Format

### Success Response
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "readings": [...],
    "count": 100
  },
  "timestamp": "2026-02-17T14:30:00Z"
}
```

### Error Response
```json
{
  "status": "error",
  "code": 400,
  "message": "Invalid request",
  "error_details": "sensor_id is required",
  "timestamp": "2026-02-17T14:30:00Z"
}
```

---

## 🔔 Alert System

### Alert Types

| Type | Threshold | Action |
|------|-----------|--------|
| High Turbidity | >100 NTU | Clean filter |
| Low Flow | <50 L/min | Check blockage |
| High Temperature | >42°C | Irrigation boost |
| Low Soil Moisture | <30% | Water plants |
| High Air Pollution | PM2.5 >100 µg/m³ | BBMP notification |

### Alert Levels

```
CRITICAL: Immediate action required
WARNING: Action needed soon
INFO: Informational only
```

### BBMP Integration
```
On CRITICAL alert:
1. Send SMS to BBMP
2. Send Email to maintenance team
3. Create ticket in system
4. Push notification to app
```

---

## 🔐 Security

### Authentication
```
- OAuth 2.0 for user login
- JWT tokens for API calls
- Token expiry: 1 hour
- Refresh token: 30 days
```

### Data Protection
```
- HTTPS/TLS encryption
- API key rotation: monthly
- Rate limiting: 1000 requests/hour
- IP whitelist for sensors
```

### Validation
```
- Input sanitization
- SQL injection prevention
- XSS protection
- CORS configuration
```

---

## 📊 Analytics Engine

### Real-Time Metrics
```
- Water saved: liters/day
- Temperature reduction: °C average
- Bus speed improvement: % increase
- Traffic reduction: % decrease
- Air quality improvement: % decrease
```

### Reports Generation
```
- Daily summary report
- Weekly performance report
- Monthly impact report
- Quarterly trend analysis
```

---

## 🚀 Deployment Architecture

### Production Setup
```
┌──────────────┐
│   Load       │
│  Balancer    │
└──────┬───────┘
       │
   ┌───┴────┬─────────┐
   │        │         │
   ↓        ↓         ↓
┌─────┐ ┌─────┐ ┌─────┐
│ API │ │ API │ │ API │
│ Srv │ │ Srv │ │ Srv │
└──┬──┘ └──┬──┘ └──┬──┘
   │       │       │
   └───┬───┴───┬───┘
       │       │
    ┌──┴──┐ ┌──┴──┐
    │  DB │ │Cache│
    └─────┘ └─────┘
```

### Recommended Stack
```
- Backend: Node.js / Python / Go
- Database: PostgreSQL / InfluxDB
- Cache: Redis
- Queue: RabbitMQ / Kafka
- Monitoring: Prometheus + Grafana
- Logging: ELK Stack
```

---

## 📈 Scalability

### Database Optimization
```
- Time-series database for sensor data
- Partitioning by date
- Indexing on sensor_id and timestamp
- Compression of old data
```

### Caching Strategy
```
- Cache recent readings (1 hour)
- Cache sensor list (24 hours)
- Cache analytics summaries (1 hour)
- Invalidate on new data
```

### Load Handling
```
- Horizontal scaling: Multiple API servers
- Database replication: Primary + Replicas
- Queue-based processing: Async jobs
- CDN for static assets
```

---

## 🧪 Testing

### Unit Tests
```
- API endpoint tests
- Data validation tests
- Alert generation tests
- Calculation tests
```

### Integration Tests
```
- Sensor data flow
- Alert system
- Email/SMS notifications
- Database operations
```

### Load Tests
```
- 10,000 sensors
- 100,000 readings/minute
- Response time <100ms
- Uptime: 99.9%
```

---

## 📝 Implementation Timeline

### Phase 1: MVP (Weeks 1-4)
- Basic API endpoints
- Single database
- Manual sensor data input
- Simple alerts

### Phase 2: IoT Integration (Weeks 5-8)
- Real IoT sensors
- Automated data collection
- Redis caching
- Advanced alerts

### Phase 3: Analytics (Weeks 9-12)
- Analytics engine
- Reporting system
- Trend analysis
- Performance dashboards

### Phase 4: Production (Weeks 13-16)
- Load testing
- Security audit
- Performance optimization
- Deployment to production

---

## 🔗 Integration Points

### Frontend Integration
```javascript
// Fetch sensor readings
fetch('/api/v1/readings?sensor_id=WQ_001')
  .then(res => res.json())
  .then(data => displayChart(data));

// Submit form data to backend
fetch('/api/v1/contact', {
  method: 'POST',
  body: JSON.stringify(formData)
});
```

### Mobile App Integration
```
- Push notifications for alerts
- Real-time data sync
- Offline mode support
- Biometric authentication
```

### BBMP Integration
```
- Daily automated reports
- Alert escalation system
- Maintenance scheduling
- Performance tracking
```

---

## 📞 Support & Maintenance

### Monitoring
- 24/7 uptime monitoring
- Performance tracking
- Error rate monitoring
- Resource utilization

### Maintenance Window
- Tuesday 2-4 AM IST
- Database backups: Daily
- Log rotation: Weekly
- Security updates: As needed

---

## 🎯 Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| API Response Time | <100ms | APM tool |
| System Uptime | 99.9% | Monitoring |
| Data Accuracy | >99% | Validation tests |
| Alert Detection | 100% | Integration tests |
| Scalability | 10k sensors | Load tests |

---

**Backend Development Status: ✅ READY FOR IMPLEMENTATION**

All architecture and specifications are complete. Ready to build and deploy!
