package com.arogyatrack.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class MlServiceClient {

    private static final Logger logger = LoggerFactory.getLogger(MlServiceClient.class);

    @Value("${arogyatrack.ml-service.url:http://localhost:5000}")
    private String mlServiceUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    @SuppressWarnings("unchecked")
    public Map<String, Object> getAssessment(Map<String, Object> featureMap) {
        String url = mlServiceUrl + "/predict";
        logger.info("Calling ML Service at: {}", url);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(featureMap, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, requestEntity, Map.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return (Map<String, Object>) response.getBody();
            } else {
                throw new RuntimeException("ML service returned status: " + response.getStatusCode());
            }
        } catch (Exception e) {
            logger.error("Failed to connect to ML service: {}", e.getMessage());
            throw new RuntimeException("Unable to connect to the assessment service: " + e.getMessage(), e);
        }
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> getModelMetrics() {
        String url = mlServiceUrl + "/metrics";
        try {
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            return (Map<String, Object>) response.getBody();
        } catch (Exception e) {
            logger.warn("Could not fetch metrics from ML service: {}", e.getMessage());
            return Map.of("status", "unavailable");
        }
    }
}
