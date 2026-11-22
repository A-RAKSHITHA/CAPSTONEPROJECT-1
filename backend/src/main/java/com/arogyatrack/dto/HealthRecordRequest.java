package com.arogyatrack.dto;

import jakarta.validation.constraints.NotNull;
import java.util.HashMap;
import java.util.Map;

public class HealthRecordRequest {

    private Long userId;

    // 24 Validated Kaggle Dataset Features
    @NotNull(message = "Age is required")
    private Double age;

    @NotNull(message = "Blood Pressure is required")
    private Double bp;

    private Double sg = 1.020; // Specific gravity
    private Double al = 0.0;   // Albumin
    private Double su = 0.0;   // Sugar

    private String rbc = "normal";
    private String pc = "normal";
    private String pcc = "notpresent";
    private String ba = "notpresent";

    @NotNull(message = "Blood Glucose Random is required")
    private Double bgr;

    @NotNull(message = "Blood Urea is required")
    private Double bu;

    @NotNull(message = "Serum Creatinine is required")
    private Double sc;

    private Double sod = 137.0; // Sodium
    private Double pot = 4.4;   // Potassium

    @NotNull(message = "Hemoglobin is required")
    private Double hemo;

    private Double pcv = 40.0;  // Packed cell volume
    private Double wc = 8000.0; // White blood cell count
    private Double rc = 4.8;    // Red blood cell count

    private String htn = "no";   // Hypertension
    private String dm = "no";    // Diabetes Mellitus
    private String cad = "no";   // Coronary artery disease
    private String appet = "good"; // Appetite
    private String pe = "no";    // Pedal edema
    private String ane = "no";   // Anemia

    public HealthRecordRequest() {}

    public Map<String, Object> toMlFeatureMap() {
        Map<String, Object> map = new HashMap<>();
        map.put("age", age);
        map.put("bp", bp);
        map.put("sg", sg != null ? sg : 1.020);
        map.put("al", al != null ? al : 0.0);
        map.put("su", su != null ? su : 0.0);
        map.put("rbc", rbc != null ? rbc : "normal");
        map.put("pc", pc != null ? pc : "normal");
        map.put("pcc", pcc != null ? pcc : "notpresent");
        map.put("ba", ba != null ? ba : "notpresent");
        map.put("bgr", bgr);
        map.put("bu", bu);
        map.put("sc", sc);
        map.put("sod", sod != null ? sod : 137.0);
        map.put("pot", pot != null ? pot : 4.4);
        map.put("hemo", hemo);
        map.put("pcv", pcv != null ? pcv : 40.0);
        map.put("wc", wc != null ? wc : 8000.0);
        map.put("rc", rc != null ? rc : 4.8);
        map.put("htn", htn != null ? htn : "no");
        map.put("dm", dm != null ? dm : "no");
        map.put("cad", cad != null ? cad : "no");
        map.put("appet", appet != null ? appet : "good");
        map.put("pe", pe != null ? pe : "no");
        map.put("ane", ane != null ? ane : "no");
        return map;
    }

    // Getters and Setters
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Double getAge() { return age; }
    public void setAge(Double age) { this.age = age; }

    public Double getBp() { return bp; }
    public void setBp(Double bp) { this.bp = bp; }

    public Double getSg() { return sg; }
    public void setSg(Double sg) { this.sg = sg; }

    public Double getAl() { return al; }
    public void setAl(Double al) { this.al = al; }

    public Double getSu() { return su; }
    public void setSu(Double su) { this.su = su; }

    public String getRbc() { return rbc; }
    public void setRbc(String rbc) { this.rbc = rbc; }

    public String getPc() { return pc; }
    public void setPc(String pc) { this.pc = pc; }

    public String getPcc() { return pcc; }
    public void setPcc(String pcc) { this.pcc = pcc; }

    public String getBa() { return ba; }
    public void setBa(String ba) { this.ba = ba; }

    public Double getBgr() { return bgr; }
    public void setBgr(Double bgr) { this.bgr = bgr; }

    public Double getBu() { return bu; }
    public void setBu(Double bu) { this.bu = bu; }

    public Double getSc() { return sc; }
    public void setSc(Double sc) { this.sc = sc; }

    public Double getSod() { return sod; }
    public void setSod(Double sod) { this.sod = sod; }

    public Double getPot() { return pot; }
    public void setPot(Double pot) { this.pot = pot; }

    public Double getHemo() { return hemo; }
    public void setHemo(Double hemo) { this.hemo = hemo; }

    public Double getPcv() { return pcv; }
    public void setPcv(Double pcv) { this.pcv = pcv; }

    public Double getWc() { return wc; }
    public void setWc(Double wc) { this.wc = wc; }

    public Double getRc() { return rc; }
    public void setRc(Double rc) { this.rc = rc; }

    public String getHtn() { return htn; }
    public void setHtn(String htn) { this.htn = htn; }

    public String getDm() { return dm; }
    public void setDm(String dm) { this.dm = dm; }

    public String getCad() { return cad; }
    public void setCad(String cad) { this.cad = cad; }

    public String getAppet() { return appet; }
    public void setAppet(String appet) { this.appet = appet; }

    public String getPe() { return pe; }
    public void setPe(String pe) { this.pe = pe; }

    public String getAne() { return ane; }
    public void setAne(String ane) { this.ane = ane; }
}
