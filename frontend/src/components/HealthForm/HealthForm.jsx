import React, { useState } from 'react';
import { HeartPulse, FlaskConical, Stethoscope, CheckCircle2, AlertCircle } from 'lucide-react';

const HealthForm = ({ initialValues = {}, onSubmit, isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    age: initialValues.age || '',
    bp: initialValues.bp || 80,
    sg: initialValues.sg || 1.020,
    al: initialValues.al || 0,
    su: initialValues.su || 0,
    rbc: initialValues.rbc || 'normal',
    pc: initialValues.pc || 'normal',
    pcc: initialValues.pcc || 'notpresent',
    ba: initialValues.ba || 'notpresent',
    bgr: initialValues.bgr || '',
    bu: initialValues.bu || '',
    sc: initialValues.sc || '',
    sod: initialValues.sod || 137,
    pot: initialValues.pot || 4.4,
    hemo: initialValues.hemo || '',
    pcv: initialValues.pcv || 40,
    wc: initialValues.wc || 8000,
    rc: initialValues.rc || 4.8,
    htn: initialValues.htn || 'no',
    dm: initialValues.dm || 'no',
    cad: initialValues.cad || 'no',
    appet: initialValues.appet || 'good',
    pe: initialValues.pe || 'no',
    ane: initialValues.ane || 'no',
  });

  const [activeTab, setActiveTab] = useState('vitals');
  const [validationError, setValidationError] = useState('');

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : parseFloat(value)) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    // Check key required fields
    if (!formData.age || !formData.bp || !formData.bgr || !formData.bu || !formData.sc || !formData.hemo) {
      setValidationError('Please complete all vital health indicators (Age, Blood Pressure, Blood Glucose, Blood Urea, Serum Creatinine, Hemoglobin).');
      setActiveTab('vitals');
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {validationError && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl text-sm flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 space-x-2 sm:space-x-4">
        <button
          type="button"
          onClick={() => setActiveTab('vitals')}
          className={`flex items-center space-x-2 pb-3 px-3 border-b-2 text-sm font-medium transition-colors ${
            activeTab === 'vitals'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <HeartPulse className="w-4 h-4" />
          <span>1. Key Vitals & Blood Tests</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('labs')}
          className={`flex items-center space-x-2 pb-3 px-3 border-b-2 text-sm font-medium transition-colors ${
            activeTab === 'labs'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <FlaskConical className="w-4 h-4" />
          <span>2. Detailed Lab Readings</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('symptoms')}
          className={`flex items-center space-x-2 pb-3 px-3 border-b-2 text-sm font-medium transition-colors ${
            activeTab === 'symptoms'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          <span>3. Clinical Observations</span>
        </button>
      </div>

      {/* TAB 1: Key Vitals */}
      {activeTab === 'vitals' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Age (Years) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="e.g. 48"
              required
              min="1"
              max="110"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
            <span className="text-xs text-slate-400 mt-1 block">Patient's current age</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Blood Pressure (mm/Hg) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              name="bp"
              value={formData.bp}
              onChange={handleChange}
              placeholder="e.g. 80"
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
            <span className="text-xs text-slate-400 mt-1 block">Normal resting BP: 70–80 mm/Hg</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Random Blood Glucose (mg/dL) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              name="bgr"
              value={formData.bgr}
              onChange={handleChange}
              placeholder="e.g. 121"
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
            <span className="text-xs text-slate-400 mt-1 block">Normal non-fasting: 90–140 mg/dL</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Blood Urea (mg/dL) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              name="bu"
              value={formData.bu}
              onChange={handleChange}
              placeholder="e.g. 36"
              required
              step="0.1"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
            <span className="text-xs text-slate-400 mt-1 block">Normal adult range: 15–45 mg/dL</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Serum Creatinine (mg/dL) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              name="sc"
              value={formData.sc}
              onChange={handleChange}
              placeholder="e.g. 1.2"
              required
              step="0.1"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
            <span className="text-xs text-slate-400 mt-1 block">Crucial kidney biomarker: 0.6–1.2 mg/dL</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Hemoglobin (g/dL) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              name="hemo"
              value={formData.hemo}
              onChange={handleChange}
              placeholder="e.g. 15.4"
              required
              step="0.1"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
            <span className="text-xs text-slate-400 mt-1 block">Normal range: 13.0–17.0 g/dL</span>
          </div>
        </div>
      )}

      {/* TAB 2: Detailed Lab Readings */}
      {activeTab === 'labs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Specific Gravity (sg)
            </label>
            <select
              name="sg"
              value={formData.sg}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            >
              <option value="1.005">1.005</option>
              <option value="1.010">1.010</option>
              <option value="1.015">1.015</option>
              <option value="1.020">1.020</option>
              <option value="1.025">1.025</option>
            </select>
            <span className="text-xs text-slate-400 mt-1 block">Urine concentration density</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Albumin Level (0 - 5)
            </label>
            <select
              name="al"
              value={formData.al}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            >
              <option value="0">0 (Nil / Normal)</option>
              <option value="1">1 (Trace)</option>
              <option value="2">2 (Mild)</option>
              <option value="3">3 (Moderate)</option>
              <option value="4">4 (Significant)</option>
              <option value="5">5 (Severe)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Sugar Level (0 - 5)
            </label>
            <select
              name="su"
              value={formData.su}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            >
              <option value="0">0 (Normal / Nil)</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Packed Cell Volume (PCV %)
            </label>
            <input
              type="number"
              name="pcv"
              value={formData.pcv}
              onChange={handleChange}
              placeholder="e.g. 40"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Sodium (sod mEq/L)
            </label>
            <input
              type="number"
              name="sod"
              value={formData.sod}
              onChange={handleChange}
              step="0.1"
              placeholder="e.g. 137"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Potassium (pot mEq/L)
            </label>
            <input
              type="number"
              name="pot"
              value={formData.pot}
              onChange={handleChange}
              step="0.1"
              placeholder="e.g. 4.4"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Red Blood Cells (rbc)
            </label>
            <select
              name="rbc"
              value={formData.rbc}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            >
              <option value="normal">Normal</option>
              <option value="abnormal">Abnormal</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Pus Cells (pc)
            </label>
            <select
              name="pc"
              value={formData.pc}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            >
              <option value="normal">Normal</option>
              <option value="abnormal">Abnormal</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Pus Cell Clumps (pcc)
            </label>
            <select
              name="pcc"
              value={formData.pcc}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            >
              <option value="notpresent">Not Present</option>
              <option value="present">Present</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Bacteria (ba)
            </label>
            <select
              name="ba"
              value={formData.ba}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            >
              <option value="notpresent">Not Present</option>
              <option value="present">Present</option>
            </select>
          </div>
        </div>
      )}

      {/* TAB 3: Clinical Observations */}
      {activeTab === 'symptoms' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Hypertension (htn)
            </label>
            <select
              name="htn"
              value={formData.htn}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Diabetes Mellitus (dm)
            </label>
            <select
              name="dm"
              value={formData.dm}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Coronary Artery Disease (cad)
            </label>
            <select
              name="cad"
              value={formData.cad}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Appetite (appet)
            </label>
            <select
              name="appet"
              value={formData.appet}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            >
              <option value="good">Good</option>
              <option value="poor">Poor</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Pedal Edema (Swelling in feet/ankles)
            </label>
            <select
              name="pe"
              value={formData.pe}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Anemia (ane)
            </label>
            <select
              name="ane"
              value={formData.ane}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>
        </div>
      )}

      {/* Submission Footer */}
      <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-slate-500">
          Biomarkers are assessed using dual Logistic Regression & Random Forest models.
        </p>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center space-x-2"
        >
          {isSubmitting ? (
            <span>Processing Assessment...</span>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" />
              <span>Save & Check Health</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default HealthForm;
