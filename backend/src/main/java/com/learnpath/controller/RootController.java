package com.learnpath.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@Tag(name = "Root", description = "Root Service Discovery & Status")
public class RootController {

    @GetMapping(value = "/", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> getRootHtml() {
        String html = """
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>LearnPath AI — Backend Services</title>
                <style>
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                        background: #0B1020;
                        color: #f8fafc;
                        margin: 0;
                        padding: 40px 20px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        min-height: 100vh;
                        box-sizing: border-box;
                    }
                    .card {
                        background: rgba(30, 41, 59, 0.7);
                        backdrop-filter: blur(12px);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        border-radius: 20px;
                        padding: 40px;
                        max-width: 600px;
                        width: 100%;
                        box-shadow: 0 20px 40px rgba(0,0,0,0.5);
                    }
                    .badge {
                        display: inline-block;
                        background: rgba(16, 185, 129, 0.2);
                        color: #34d399;
                        border: 1px solid rgba(16, 185, 129, 0.4);
                        padding: 4px 12px;
                        border-radius: 9999px;
                        font-size: 12px;
                        font-weight: 600;
                        margin-bottom: 16px;
                    }
                    h1 {
                        margin: 0 0 10px;
                        font-size: 28px;
                        font-weight: 800;
                        background: linear-gradient(135deg, #818cf8, #c084fc);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                    }
                    p {
                        color: #94a3b8;
                        font-size: 14px;
                        line-height: 1.6;
                        margin-bottom: 24px;
                    }
                    .links {
                        display: flex;
                        flex-direction: column;
                        gap: 12px;
                    }
                    .btn {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        padding: 14px 20px;
                        border-radius: 12px;
                        text-decoration: none;
                        font-weight: 600;
                        font-size: 14px;
                        transition: all 0.2s;
                    }
                    .btn-primary {
                        background: #4f46e5;
                        color: white;
                    }
                    .btn-primary:hover {
                        background: #4338ca;
                    }
                    .btn-secondary {
                        background: rgba(255, 255, 255, 0.05);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        color: #cbd5e1;
                    }
                    .btn-secondary:hover {
                        background: rgba(255, 255, 255, 0.1);
                        color: white;
                    }
                    .footer {
                        margin-top: 24px;
                        font-size: 12px;
                        color: #64748b;
                        text-align: center;
                    }
                </style>
            </head>
            <body>
                <div class="card">
                    <span class="badge">● Backend Online (Port 8080)</span>
                    <h1>LearnPath AI Backend API</h1>
                    <p>
                        The Spring Boot 3 microservice is active and healthy. Port 8080 serves the RESTful API endpoints. For the interactive student and teacher web application, navigate to the frontend interface.
                    </p>
                    <div class="links">
                        <a href="http://localhost:3000" class="btn btn-primary" target="_blank">
                            <span>Open Web Application (Frontend)</span>
                            <span>→</span>
                        </a>
                        <a href="/swagger-ui.html" class="btn btn-secondary">
                            <span>Swagger UI Interactive API Documentation</span>
                            <span>↗</span>
                        </a>
                        <a href="http://localhost:8000/docs" class="btn btn-secondary" target="_blank">
                            <span>FastAPI AI Microservice Documentation</span>
                            <span>↗</span>
                        </a>
                        <a href="/actuator/health" class="btn btn-secondary">
                            <span>Spring Boot Actuator Health Check</span>
                            <span>↗</span>
                        </a>
                    </div>
                    <div class="footer">
                        LearnPath AI &copy; 2026 &bull; Spring Boot 3 &bull; Java 21 &bull; PostgreSQL
                    </div>
                </div>
            </body>
            </html>
            """;
        return ResponseEntity.ok(html);
    }

    @GetMapping(value = "/api/status", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Backend Service Status", description = "Returns service health and navigation links")
    public ResponseEntity<Map<String, Object>> getRootJson() {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("service", "LearnPath AI — Spring Boot Backend API");
        response.put("status", "UP");
        response.put("version", "1.0.0");
        response.put("message", "Backend is running on port 8080. Open http://localhost:3000 in your browser for the web application.");

        Map<String, String> links = new LinkedHashMap<>();
        links.put("webApp", "http://localhost:3000");
        links.put("swaggerUi", "http://localhost:8080/swagger-ui.html");
        links.put("apiDocs", "http://localhost:8080/api-docs");
        links.put("healthCheck", "http://localhost:8080/actuator/health");
        links.put("aiServiceDocs", "http://localhost:8000/docs");
        response.put("links", links);

        return ResponseEntity.ok(response);
    }
}
