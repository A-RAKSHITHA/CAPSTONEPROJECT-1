package com.arogyatrack.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "health_records")
public class HealthRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // 24 Validated Kaggle Dataset Features
    private Double age;
    private Double bp;
    private Double sg;
    private Double al;
    private Double su;

    @Column(length = 20)
    private String rbc; // normal, abnormal

    @Column(length = 20)
    private String pc; // normal, abnormal

    @Column(length = 20)
    private String pcc; // present, notpresent

    @Column(length = 20)
    private String ba; // present, notpresent

    private Double bgr;
    private Double bu;
    private Double sc;
    private Double sod;
    private Double pot;
    private Double hemo;
    private Double pcv;
    private Double wc;
    private Double rc;

    @Column(length = 10)
    private String htn; // yes, no

    @Column(length = 10)
    private String dm; // yes, no

    @Column(length = 10)
    private String cad; // yes, no

    @Column(length = 20)
    private String appet; // good, poor

    @Column(length = 10)
    private String pe; // yes, no

    @Column(length = 10)
    private String ane; // yes, no

    @Column(name = "recorded_at", updatable = false)
    private LocalDateTime recordedAt;

    @PrePersist
    protected void onCreate() {
        this.recordedAt = LocalDateTime.now();
    }

    public HealthRecord() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

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

    public LocalDateTime getRecordedAt() { return recordedAt; }
    public void setRecordedAt(LocalDateTime recordedAt) { this.recordedAt = recordedAt; }
}
