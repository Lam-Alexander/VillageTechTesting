import React, { useState, useEffect } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import PatientTabs from '../../../components/PatientTabs';
import PatientSidebar from '../../../components/patientSidebar/PatientSidebar';
import { usePatient } from '../../../context/PatientContext';
import { Edit2, Save } from 'lucide-react';
import "./Clinical.css";

const Clinical = () => {
  const { selectedPatient, setSelectedPatient } = usePatient();
  const [clinicalData, setClinicalData] = useState({});
  const [medications, setMedications] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [ownerInfo, setOwnerInfo] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [xrayFile, setXrayFile] = useState(null);
  const [error, setError] = useState(null);
  const supabase = useSupabaseClient();

  useEffect(() => {
    if (selectedPatient) {
      fetchClinicalData();
      fetchMedications();
      fetchTreatments();
      fetchOwnerInfo();
    }
  }, [selectedPatient]);

  const fetchClinicalData = async () => {
    try {
      const { data, error } = await supabase
        .from("clinical_records")
        .select("*")
        .eq("patient_id", selectedPatient.id)
        .single();

      if (error) throw error;
      setClinicalData(data || {});
    } catch (error) {
      console.error("Error fetching clinical data:", error);
      setError("Failed to fetch clinical data. Please try again later.");
    }
  };

  const fetchMedications = async () => {
    try {
      const { data, error } = await supabase
        .from("medications")
        .select("*")
        .eq("patient_id", selectedPatient.id);

      if (error) throw error;
      setMedications(data || []);
    } catch (error) {
      console.error("Error fetching medications:", error);
      setError("Failed to fetch medications. Please try again later.");
    }
  };

  const fetchTreatments = async () => {
    try {
      const { data, error } = await supabase
        .from("soc")
        .select("*")
        .eq("patient_id", selectedPatient.id);

      if (error) throw error;
      setTreatments(data || []);
    } catch (error) {
      console.error("Error fetching treatments:", error);
      setError("Failed to fetch treatments. Please try again later.");
    }
  };

  const fetchOwnerInfo = async () => {
    try {
      const { data, error } = await supabase
        .from("owners")
        .select("*")
        .eq("id", selectedPatient.owner_id)
        .single();

      if (error) throw error;
      setOwnerInfo(data || {});
    } catch (error) {
      console.error("Error fetching owner info:", error);
      setError("Failed to fetch owner info. Please try again later.");
    }
  };

  const handleSave = async () => {
    try {
      if (clinicalData?.id) {
        // Update existing clinical record
        const { error } = await supabase
          .from("clinical_records")
          .update({ ...clinicalData, xray_file: xrayFile })
          .eq("id", clinicalData.id);
  
        if (error) throw error;
      } else {
        // Insert a new clinical record for the selected patient
        const { error } = await supabase
          .from("clinical_records")
          .insert({
            patient_id: selectedPatient.id,
            abnormalities: clinicalData.abnormalities,
            diet: clinicalData.diet,
            xray_file: xrayFile,
            created_at: new Date().toISOString(), // Adding created_at for the new record
          });
  
        if (error) throw error;
      }
  
      if (selectedPatient?.id) {
        // Update patient information if necessary
        const { error } = await supabase
          .from("patients")
          .update({
            name: selectedPatient.name,
            species: selectedPatient.species,
            breed: selectedPatient.breed,
            gender: selectedPatient.gender,
          })
          .eq("id", selectedPatient.id);
  
        if (error) throw error;
      }
  
      setIsEditing(false);
      setError(null);
    } catch (error) {
      console.error("Error saving clinical data:", error);
      setError("Failed to save clinical data. Please try again.");
    }
  };
  

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClinicalData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePatientInputChange = (e, field) => {
    const { value } = e.target;
    setSelectedPatient((prev) => ({ ...prev, [field]: value }));
  };

  const handleXrayUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const { data, error } = await supabase.storage
        .from("xrays")
        .upload(`public/${file.name}`, file);

      if (error) throw error;

      const publicURL = supabase.storage
        .from("xrays")
        .getPublicUrl(`public/${file.name}`).publicURL;
      setXrayFile(publicURL);
    } catch (error) {
      console.error("Error uploading X-ray:", error);
      setError("Failed to upload X-ray. Please try again.");
    }
  };

  return (
    <div className="clinical-main">
      <PatientSidebar />

      <div className="clinical-page">
        <header className="patient-header">
          <PatientTabs />
        </header>

        {error && <div className="error-message">{error}</div>}

        <div className="section-box">
          <h2 className="section-header">Clinical Record</h2>
          <div className="info-grid">
            <div className="info-item">
              <div className="info-label">Animal Name</div>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={selectedPatient?.name || ""}
                  onChange={(e) => handlePatientInputChange(e, 'name')}
                />
              ) : (
                <div className="info-value">{selectedPatient?.name || "N/A"}</div>
              )}
            </div>

            <div className="info-item">
              <div className="info-label">Owner</div>
              <div className="info-value">{`${ownerInfo?.first_name || ""} ${ownerInfo?.last_name || ""}` || "N/A"}</div>
            </div>

            <div className="info-item">
              <div className="info-label">Address</div>
              <div className="info-value">{ownerInfo?.address || "N/A"}</div>
            </div>

            <div className="info-item">
              <div className="info-label">Primary Phone</div>
              <div className="info-value">{ownerInfo?.phone_number || "N/A"}</div>
            </div>

            <div className="info-item">
              <div className="info-label">Species</div>
              {isEditing ? (
                <input
                  type="text"
                  name="species"
                  value={selectedPatient?.species || ""}
                  onChange={(e) => handlePatientInputChange(e, 'species')}
                />
              ) : (
                <div className="info-value">{selectedPatient?.species || "N/A"}</div>
              )}
            </div>

            <div className="info-item">
              <div className="info-label">Breed</div>
              {isEditing ? (
                <input
                  type="text"
                  name="breed"
                  value={selectedPatient?.breed || ""}
                  onChange={(e) => handlePatientInputChange(e, 'breed')}
                />
              ) : (
                <div className="info-value">{selectedPatient?.breed || "N/A"}</div>
              )}
            </div>

            <div className="info-item">
              <div className="info-label">X-ray File</div>
              {isEditing ? (
                <input type="file" onChange={handleXrayUpload} />
              ) : (
                <div className="info-value">
                  {clinicalData?.xray_file ? (
                    <a href={clinicalData.xray_file} target="_blank" rel="noopener noreferrer">
                      View X-ray
                    </a>
                  ) : (
                    "No X-ray available"
                  )}
                </div>
              )}
            </div>

            <div className="info-item">
              <div className="info-label">Abnormalities</div>
              {isEditing ? (
                <input
                  type="text"
                  name="abnormalities"
                  value={clinicalData?.abnormalities || ""}
                  onChange={handleInputChange}
                />
              ) : (
                <div className="info-value">{clinicalData?.abnormalities || "N/A"}</div>
              )}
            </div>

            <div className="info-item">
              <div className="info-label">Diet</div>
              {isEditing ? (
                <input
                  type="text"
                  name="diet"
                  value={clinicalData?.diet || ""}
                  onChange={handleInputChange}
                />
              ) : (
                <div className="info-value">{clinicalData?.diet || "N/A"}</div>
              )}
            </div>
          </div>

          <div className="clinical-edit-actions">
            {isEditing ? (
              <button className="save-button" onClick={handleSave}>
                <Save size={18} />
                Save
              </button>
            ) : (
              <button className="edit-button" onClick={handleEdit}>
                <Edit2 size={18} />
                Edit
              </button>
            )}
          </div>
        </div>

        <div className="section-box">
          <h2 className="section-header">Medications & Vaccines</h2>
          <div className="info-grid">
            {medications.map((med) => (
              <div key={med.id} className="info-item">
                <div className="info-label">{med.name}</div>
                <div className="info-value">
                  Dosage: {med.dosage}, Frequency: {med.frequency}, Prescribed on: {new Date(med.date_prescribed).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="section-box">
          <h2 className="section-header">Treatments</h2>
          <div className="info-grid">
            {treatments.map((treatment) => (
              <div key={treatment.id} className="info-item">
                <div className="info-label">Date: {new Date(treatment.fulfilled_at).toLocaleDateString()}</div>
                <div className="info-value">Event: {treatment.event_name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clinical;
