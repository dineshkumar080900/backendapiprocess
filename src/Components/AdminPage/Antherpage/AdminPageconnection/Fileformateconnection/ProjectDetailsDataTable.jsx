import React, { useEffect, useMemo, useState } from "react";
import {
  FiPlus, FiInfo, FiTag, FiKey, FiList, FiEdit, FiTrash2, FiEye, FiX, FiSearch,
  FiCheckCircle, FiClock, FiFileText, FiUpload, FiImage, FiSave, FiRefreshCw,
  FiChevronLeft, FiChevronRight, FiLoader,
  FiRefreshCcw,
  FiUploadCloud, FiLayers,
  FiMapPin,
} from "react-icons/fi";
import { FaBuilding, FaCheckCircle as FaCheck } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/**
 * ProjectDashboard (Admin)
 * - Step 1: Basic project info (Add/Edit)
 * - Step 2: Project details (uses `$` as line separator for multi-lines)
 * - View modal: shows details with values joined by ", "
 */
const ProjectDashboard = () => {
  // -------- UI / Filters --------
  const [isMobile, setIsMobile] = useState(false);
  const [viewImg, setViewImg] = useState(null);
  const [existingDetail, setExistingDetail] = useState(null);

  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all | active | draft
  const [filterType, setFilterType] = useState("all");
  const [projectTypes, setProjectTypes] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "pid", direction: "asc" });
  const [loading, setLoading] = useState(false);
  // after: const [pid, setPid] = useState(null);
  const [detailId, setDetailId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const showImage = (src) => setImagePreview(src);
  const closeImage = () => setImagePreview(null);


  // -------- Step 1 (Basic) --------
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [imageUploads, setImageUploads] = useState({
    project_cover_img: null,
    project_small_img: null,
    ovimg: null,
    attached_brochare: null,
  });
  const [imagePreviews, setImagePreviews] = useState({
    project_cover_img: null,
    project_small_img: null,
    ovimg: null,
  });

  const [formData, setFormData] = useState({
    pcid: "",
    project_name: "",
    project_type: "",
    project_highlights: "",
    project_status: "",
    project_location: "",
    project_overview: "",
    amenities: "",
    specification: "",
    location_advantage: "",
    video_link: "",
    location_map: "",
    google_map: "",
    walkthrough_link: "",
    get_direction: "",
    ptitle: "",
    mdesc: "",
    mkeyword: "",
    oglink: "",
    is_live: 0,
  });

  // -------- Step 2 (Details) --------
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [pid, setPid] = useState(null);
  const [details, setDetails] = useState(mapDetailsToState());
  const [resetKey, setResetKey] = useState(0); // to clear file inputs

  // -------- View modal --------
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const API_BASE_URL = "admin.mithahomes.com/api/admin/projects";

  // -------- Screen size --------
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    fn();
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  // -------- Fetch projects --------
  useEffect(() => {
    fetchProjects();
  }, [page, searchTerm, filterStatus, filterType]);

  async function fetchProjects() {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "10",
        ...(searchTerm && { q: searchTerm }),
        ...(filterStatus !== "all" && { status: filterStatus }),
        ...(filterType !== "all" && { type: filterType }),
      });
      const res = await fetch(`${API_BASE_URL}?${params.toString()}`, { credentials: "include" });
      const data = await res.json();
      if (!res.ok || !data?.success) throw new Error(data?.message || "Failed to fetch projects");

      const rows = data.data || [];
      // normalize live flag
      const normalized = rows.map((r) => ({ ...r, is_live: isLiveValue(r.is_live) ? 1 : 0 }));
      setProjects(normalized);
      setTotalPages(Math.max(1, Math.ceil((data.totalCount || normalized.length) / 10)));
      setProjectTypes([...new Set(normalized.map((r) => r.project_type).filter(Boolean))]);

      // Removed the “Projects loaded” toast to reduce blinking
    } catch (e) {
      console.error(e);
      toast.error("Failed to fetch projects");
      setProjects([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }


  // const showImage = (src) => setViewImg(src);
  // const closeImage = () => setViewImg(null);

  // -------- Helpers --------
  function isLiveValue(v) {
    return v === 1 || v === "1" || v === true || v === "Live";
  }
  function LiveChip({ value }) {
    const live = isLiveValue(value);
    return (
      <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
        {live ? <FiCheckCircle size={12} /> : <FiClock size={12} />}
        {live ? "Live" : "Draft"}
      </div>
    );
  }
  function setFormField(name, value) {
    setFormData((v) => ({ ...v, [name]: value }));
  }
  function handleImageUpload(e, key) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImageUploads((v) => ({ ...v, [key]: file }));
    setImagePreviews((v) => ({ ...v, [key]: url }));
  }
  function removeImage(key) {
    setImageUploads((v) => ({ ...v, [key]: null }));
    setImagePreviews((v) => ({ ...v, [key]: null }));
  }

  // -------- Sort/filter memo --------
  const filteredProjects = useMemo(() => {
    const f = projects.filter((p) => {
      const s = (searchTerm || "").toLowerCase();
      const matchesSearch =
        (p.project_name || "").toLowerCase().includes(s) ||
        (p.project_type || "").toLowerCase().includes(s) ||
        (p.project_location || "").toLowerCase().includes(s);
      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "active" ? p.is_live === 1 : p.is_live === 0);
      const matchesType = filterType === "all" || p.project_type === filterType;
      return matchesSearch && matchesStatus && matchesType;
    });
    return f.sort((a, b) => {
      const A = a[sortConfig.key];
      const B = b[sortConfig.key];
      if (A < B) return sortConfig.direction === "asc" ? -1 : 1;
      if (A > B) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [projects, searchTerm, filterStatus, filterType, sortConfig]);

  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => p.is_live === 1).length;
  const residentialProjects = projects.filter((p) => p.project_type === "Residential").length;
  const commercialProjects = projects.filter((p) => p.project_type === "Commercial").length;

  // -------- Step 1: Save basic (Next) --------
  async function handleNext(e) {
    e.preventDefault();
    if (!formData.project_name || !formData.project_type || !formData.pcid) {
      toast.error("Please fill Project Name, Project Type, and Category ID.");
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => v !== null && v !== undefined && fd.append(k, v));
      Object.entries(imageUploads).forEach(([k, file]) => file && fd.append(k, file));

      const res = await fetch(API_BASE_URL, { method: "POST", body: fd, credentials: "include" });
      const data = await res.json();
      if (!res.ok || !data?.success || !data?.data?.pid) throw new Error(data?.message || "Failed to save");

      const newPid = data.data.pid;
      setPid(newPid);
      setShowModal(false);
      setShowDetailsModal(true);
      await fetchProjects(); // only refetch once; no optimistic push (prevents duplicates)
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Save failed");
    } finally {
      setLoading(false);
    }
  }

  // -------- Step 2: Details save --------
  function handleDetailChange(e) {
    const { name, value, files } = e.target;
    setDetails((prev) => ({ ...prev, [name]: files ? files : value }));
  }

  async function handleDetailsSave(e) {
    e.preventDefault();
    if (!pid) {
      toast.error("Missing project id (pid). Save basic info first.");
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(details).forEach(([k, v]) => {
        if (v !== null && v !== undefined) {
          if (v instanceof FileList) Array.from(v).forEach((f) => fd.append(k, f));
          else fd.append(k, v);
        }
      });

      // ✅ If creating first time, backend needs pid
      if (!detailId) {
        fd.append("pid", pid);
      }

      // ✅ decide POST or PUT
      const url = detailId
        ? `admin.mithahomes.com/api/admin/project-details/${detailId}`  // update
        : `admin.mithahomes.com/api/admin/project-details`;             // create

      const method = detailId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: fd,
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok || !data?.success) throw new Error(data?.message || "Could not save details");

      // ✅ reset UI
      setShowDetailsModal(false);
      setPid(null);
      setDetailId(null);
      setDetails(mapDetailsToState({}));
      setResetKey((k) => k + 1);
      await fetchProjects();
      toast.success("Project details saved!");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Could not save details.");
    } finally {
      setLoading(false);
    }
  }


  // -------- Edit/Delete basic --------
  function editProject(project) {
    setEditingProject(project);

    // reset file selections to avoid stale uploads
    setImageUploads({
      project_cover_img: null,
      project_small_img: null,
      ovimg: null,
      attached_brochare: null,
    });
    setImagePreviews({
      project_cover_img: project.project_cover_img || null,
      project_small_img: project.project_small_img || null,
      ovimg: project.ovimg || null,
    });

    setFormData({
      pcid: project.pcid || "",
      project_name: project.project_name || "",
      project_type: project.project_type || "",
      project_highlights: project.project_highlights || "",
      project_status: project.project_status || "",
      project_location: project.project_location || "",
      project_overview: project?.project_overview ?? "",
      amenities: project?.amenities ?? "",
      specification: project?.specification ?? "",
      location_advantage: project?.location_advantage ?? "",
      attached_brochare: project?.attached_brochare ?? "",
      video_link: project?.video_link ?? "",
      location_map: project?.location_map ?? "",
      google_map: project?.google_map ?? "",
      walkthrough_link: project?.walkthrough_link ?? "",
      get_direction: project?.get_direction ?? "",
      ptitle: project?.ptitle ?? "",
      mdesc: project?.mdesc ?? "",
      mkeyword: project?.mkeyword ?? "",
      oglink: project?.oglink ?? "",
      is_live: project?.is_live ?? 0,
    });

    setShowModal(true);
  }

  async function saveProjectBasicUpdate() {
    if (!editingProject) return;
    setLoading(true);
    try {
      const fd = new FormData();
      // append all basic fields
      Object.entries(formData).forEach(([k, v]) => {
        if (v !== null && v !== undefined) fd.append(k, v);
      });
      // append uploaded files (cover/small/overview/brochure)
      Object.entries(imageUploads).forEach(([k, file]) => {
        if (file) fd.append(k, file);
      });

      // update basic info
      const res = await fetch(`${API_BASE_URL}/${editingProject.pid}`, {
        method: "PUT",
        body: fd,
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok || !data?.success) throw new Error(data?.message || "Failed to update");

      // refresh list so table shows updated values
      await fetchProjects();

      // close basic modal
      setShowModal(false);

      // open the Details modal for THIS project
      await openEditDetails({ pid: editingProject.pid });

      // clear editing state (after handing pid to details modal)
      setEditingProject(null);

      toast.success("Project updated");
    } catch (err) {
      console.error(err);
      toast.error("Error saving project");
    } finally {
      setLoading(false);
    }
  }


  async function deleteProject(id) {
    if (!window.confirm("Delete this project?")) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok || !data?.success) throw new Error(data?.message || "Delete failed");
      await fetchProjects();
      toast.success("Project deleted");
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setFormData({
      pcid: "",
      project_name: "",
      project_type: "",
      project_highlights: "",
      project_status: "",
      project_location: "",
      project_overview: "",
      amenities: "",
      specification: "",
      location_advantage: "",
      video_link: "",
      location_map: "",
      google_map: "",
      walkthrough_link: "",
      get_direction: "",
      ptitle: "",
      mdesc: "",
      mkeyword: "",
      oglink: "",
      is_live: 0,
    });
    setImageUploads({
      project_cover_img: null,
      project_small_img: null,
      ovimg: null,
      attached_brochare: null,
    });
    setImagePreviews({
      project_cover_img: null,
      project_small_img: null,
      ovimg: null,
    });
    setEditingProject(null);
  }

  async function toggleProjectStatus(project) {
    const nextIsLive = isLiveValue(project.is_live) ? 0 : 1;
    try {
      const res = await fetch(`${API_BASE_URL}/${project.pid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ is_live: nextIsLive }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      await fetchProjects();
    } catch (err) {
      toast.error(err?.message || "Could not update project status");
      console.error(err);
    }
  }

  // -------- Details fetch/hydrate --------
  async function fetchProjectDetailsByPid(id) {
    try {
      // MUST be GET to fetch (PUT earlier caused odd behavior)
      const res = await fetch(`admin.mithahomes.com/api/admin/project-details/${id}`, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) return [];
      const json = await res.json();
      const arr =
        (Array.isArray(json?.data) && json.data) ||
        (Array.isArray(json) && json) ||
        (json?.data && typeof json.data === "object" ? [json.data] : []) ||
        (json && typeof json === "object" ? [json] : []);
      return arr.filter(Boolean);
    } catch {
      return [];
    }
  }




  function mapDetailsToState(row = {}) {
    return {
      plan_name: row.plan_name || "",
      flat_det: row.flat_det || "",
      flat_img: null,

      gtype1: row.gtype1 || "", gtype1_det: row.gtype1_det || "", gtype1_img: null,
      gtype2: row.gtype2 || "", gtype2_det: row.gtype2_det || "", gtype2_img: null,
      gtype3: row.gtype3 || "", gtype3_det: row.gtype3_det || "", gtype3_img: null,
      gtype4: row.gtype4 || "", gtype4_det: row.gtype4_det || "", gtype4_img: null,
      gtype5: row.gtype5 || "", gtype5_det: row.gtype5_det || "", gtype5_img: null,
      gtype6: row.gtype6 || "", gtype6_det: row.gtype6_det || "", gtype6_img: null,
      gtype7: row.gtype7 || "", gtype7_det: row.gtype7_det || "", gtype7_img: null,
      gtype8: row.gtype8 || "", gtype8_det: row.gtype8_det || "", gtype8_img: null,
      gtype9: row.gtype9 || "", gtype9_det: row.gtype9_det || "", gtype9_img: null,
      gtype10: row.gtype10 || "", gtype10_det: row.gtype10_det || "", gtype10_img: null,

      area_market_price: row.area_market_price || "",
      area_our_price: row.area_our_price || "",
      area_flat_number: row.area_flat_number || "",
      area_total_sqft: row.area_total_sqft || "",
      area_noofbhk: row.area_noofbhk || "",
      property_specification_left: row.property_specification_left || "",
      property_specification_right: row.property_specification_right || "",
      ps_details: row.ps_details || "",
      ps_payment: row.ps_payment || "",
    };
  }
  // below joinDollar
  const splitComma = (s) =>
    (s || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

  const splitDollar = (s) =>
    (s || "")
      .split("$")
      .map((t) => t.trim())
      .filter(Boolean);



  async function openEditDetails(project) {
    const id = project?.pid || null;
    if (!id) return;

    setPid(id);
    setDetails(mapDetailsToState({})); // clear stale values
    setResetKey((k) => k + 1);         // clear file inputs

    const rows = await fetchProjectDetailsByPid(id); // <-- uses the new loader
    const first = Array.isArray(rows) ? rows[0] : rows || {};
    setDetails(mapDetailsToState(first || {}));      // hydrate text fields
    setExistingDetail(first || null);     // <-- keep originals for preview
    setDetailId(first?.pdid || null);

    setShowDetailsModal(true);
    setShowModal(false);
  }


  // When opening View, ensure details array is flat
  useEffect(() => {
    (async () => {
      if (showProjectModal && selectedProject?.pid && !selectedProject?.project_det) {
        const d = await fetchProjectDetailsByPid(selectedProject.pid);
        if (d) setSelectedProject((sp) => ({ ...sp, project_det: d }));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showProjectModal, selectedProject?.pid]);

  // -------- Styles (kept as-is) --------
  const styles = {
    body: { backgroundColor: "#F7FAFC", color: "#2D3748", lineHeight: 1.6, margin: 0, padding: 0, fontFamily: "'Inter', system-ui, sans-serif", minHeight: "100vh" },
    container: { maxWidth: 1400, margin: "0 auto", padding: isMobile ? "0 15px" : "0 20px" },
    mainContent: { display: "flex", marginTop: isMobile ? "20px" : "30px", gap: isMobile ? "15px" : "25px", flexDirection: "column" },
    content: { flex: 1, backgroundColor: "white", borderRadius: "16px", boxShadow: "0 4px 6px rgba(0,0,0,.05)", padding: isMobile ? "20px" : "30px", border: "1px solid #E2E8F0" },
    contentHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: isMobile ? "20px" : "30px", paddingBottom: isMobile ? "15px" : "25px", borderBottom: "2px solid #F7FAFC", gap: isMobile ? "15px" : "0", flexWrap: "wrap" },
    contentTitle: { fontSize: isMobile ? "1.4rem" : "1.75rem", fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: 12, color: "#2D3748" },
    headerActions: { display: "flex", gap: 10, flexWrap: "wrap" },
    btn: { padding: isMobile ? "10px 16px" : "12px 20px", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 8, transition: "all .3s", fontSize: isMobile ? 13 : 14, fontFamily: "inherit", whiteSpace: "nowrap" },
    btnPrimary: { background: "linear-gradient(135deg,#E36324 0%,#FF7B42 100%)", color: "white", boxShadow: "0 2px 4px rgba(227,99,36,.3)" },
    btnOutline: { backgroundColor: "transparent", color: "#718096", border: "2px solid #E2E8F0" },
    statsCards: { display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(auto-fit,minmax(220px,1fr))", gap: isMobile ? 15 : 20, marginBottom: isMobile ? 20 : 30 },
    statCard: { background: "white", borderRadius: 12, boxShadow: "0 4px 6px rgba(0,0,0,.05)", padding: isMobile ? 20 : 25, display: "flex", flexDirection: "column", gap: 12, border: "1px solid #F0F0F0" },
    statIcon: { width: isMobile ? 40 : 50, height: isMobile ? 40 : 50, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: isMobile ? "1.2rem" : "1.5rem", background: "#E36324" },
    statValue: { fontSize: isMobile ? "1.5rem" : "2rem", fontWeight: 700, color: "#E36324" },
    statLabel: { color: "#718096", fontSize: isMobile ? 12 : 14, fontWeight: 500 },
    searchFilterContainer: { display: "flex", gap: isMobile ? 10 : 15, marginBottom: isMobile ? 20 : 25, flexWrap: "wrap" },
    searchInput: { minWidth: isMobile ? "auto" : 250, padding: "12px 12px 12px 40px", border: "1px solid #E2E8F0", borderRadius: 10, fontSize: isMobile ? 14 : "1rem", fontFamily: "inherit" },
    select: { padding: 12, border: "1px solid #E2E8F0", borderRadius: 10, fontSize: isMobile ? 14 : "1rem", background: "white", minWidth: isMobile ? "100%" : 150, fontFamily: "inherit" },
    tableContainer: { overflowX: "auto", borderRadius: 12, border: "1px solid #E2E8F0", boxShadow: "0 2px 4px rgba(0,0,0,.05)", WebkitOverflowScrolling: "touch" },
    table: { width: "100%", borderCollapse: "collapse", minWidth: isMobile ? "1000px" : "1100px" },
    thead: { padding: isMobile ? 12 : 16, textAlign: "left", borderBottom: "2px solid #E2E8F0", background: "#F7FAFC", fontWeight: 600, color: "#2D3748" },
    th: { padding: isMobile ? 12 : 16, textAlign: "left", borderBottom: "2px solid #E2E8F0", background: "#F7FAFC", fontWeight: 600, color: "#2D3748" },
    td: { padding: isMobile ? 12 : 16, textAlign: "left", borderBottom: "1px solid #E2E8F0", fontSize: isMobile ? 13 : 14, verticalAlign: "top" },
    actionButtons: { display: "flex", gap: 6, flexWrap: "wrap" },
    actionBtn: { padding: "6px 10px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", gap: 4, fontWeight: 500, whiteSpace: "nowrap" },
    actionView: { background: "rgba(113,128,150,.1)", color: "#718096", border: "1px solid rgba(113,128,150,.2)" },
    actionEdit: { background: "rgba(49,130,206,.1)", color: "#3182CE", border: "1px solid rgba(49,130,206,.2)" },
    actionDelete: { background: "rgba(229,62,62,.1)", color: "#E53E3E", border: "1px solid rgba(229,62,62,.2)" },
    status: { padding: "6px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 6, border: "none", cursor: "pointer" },
    statusActive: { background: "rgba(93,195,80,.15)", color: "#276749" },
    statusInactive: { background: "rgba(229,62,62,.15)", color: "#C53030" },
    pagination: { display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 20, padding: 20, flexWrap: "wrap" },
    pageButton: { padding: "8px 12px", border: "1px solid #E2E8F0", background: "white", borderRadius: 8, cursor: "pointer", fontSize: 14, minWidth: 40, display: "flex", alignItems: "center", justifyContent: "center" },
    activePage: { background: "#E36324", color: "white", borderColor: "#E36324" },
    modal: { display: "flex", position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,.6)", zIndex: 1000, alignItems: "center", justifyContent: "center", padding: isMobile ? 10 : 20, backdropFilter: "blur(4px)" },
    modalContent: { background: "white", borderRadius: 16, width: "100%", maxWidth: isMobile ? "100%" : 1000, boxShadow: "0 20px 25px rgba(0,0,0,.15)", overflow: "hidden", maxHeight: "90vh", overflowY: "auto" },
    modalHeader: { padding: isMobile ? 20 : 25, background: "linear-gradient(135deg,#E36324 0%,#FF7B42 100%)", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" },
    modalTitle: { fontSize: isMobile ? "1.2rem" : "1.4rem", fontWeight: 600, margin: 0, display: "flex", alignItems: "center", gap: 10 },
    closeBtn: { background: "rgba(255,255,255,.2)", border: "none", color: "white", fontSize: "1.5rem", cursor: "pointer", width: 36, height: 36, borderRadius: 8 },
    modalBody: { padding: isMobile ? 20 : 30, display: "flex", flexDirection: isMobile ? "column" : "row", gap: isMobile ? 20 : 30 },
    modalColumn: { flex: 1, display: "flex", flexDirection: "column", gap: 20 },
    formGroup: { marginBottom: isMobile ? 15 : 20 },
    formLabel: { display: "block", marginBottom: 8, fontWeight: 600, color: "#2D3748", display: "flex", alignItems: "center", gap: 8, fontSize: isMobile ? 14 : 15 },
    formControl: { width: "100%", padding: isMobile ? 10 : 12, border: "1px solid #E2E8F0", borderRadius: 8, fontSize: isMobile ? 14 : "1rem", fontFamily: "inherit" },
    textarea: { minHeight: 100, resize: "vertical" },
    imageUploadArea: { border: "2px dashed #E2E8F0", borderRadius: 8, padding: isMobile ? 15 : 20, textAlign: "center", marginBottom: 15, cursor: "pointer" },
    imagePreviewContainer: { display: "flex", gap: 10, flexWrap: "wrap", marginTop: 15 },
    imagePreviewItem: { position: "relative", display: "inline-block" },
    imagePreviewLarge: { width: 80, height: 80, objectFit: "cover", borderRadius: 8, border: "1px solid #E2E8F0" },
    removeImageBtn: { position: "absolute", top: -8, right: -8, background: "#E53E3E", color: "white", border: "none", borderRadius: "50%", width: 20, height: 20, fontSize: 12, cursor: "pointer" },
    modalFooter: { padding: isMobile ? 20 : 25, background: "#F7FAFC", display: "flex", justifyContent: "flex-end", gap: 12, borderTop: "1px solid #E2E8F0", flexWrap: "wrap" },
    projectWrap: { display: "flex", flexDirection: "column", gap: 16 },

    detailCard: {
      marginBottom: 16,
      padding: 12,
      background: "#FFF7F0",
      borderRadius: 8,
      border: "1px solid #FBD4B4",
    },

    detailGrid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
    detailGrid3: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 },

    kvBlock: { background: "#FFF", border: "1px solid #F1F5F9", borderRadius: 8, padding: 10 },
    kvTitle: { fontWeight: 700, marginBottom: 6, color: "#0F172A" },

    galleryTitle: { fontWeight: 700, marginBottom: 6, color: "#0F172A" },
    thumb: { width: 90, height: 70, objectFit: "cover", borderRadius: 6, border: "1px solid #eee", cursor: "pointer" },

    projectField: { display: "flex", gap: 10, alignItems: "flex-start", margin: "8px 0" },
    projectIcon: { fontSize: 16, color: "#64748B", marginTop: 4 },
    projectLabel: {
      fontWeight: 700,
      color: '#2D3748',
      fontSize: '15px',
      marginBottom: '4px'
    },
    projectValue: { fontSize: 15, color: "#0F172A" },

  };



  // -------- RENDER --------
  function renderTable() {
    return (
      <table style={styles.table}>
        <thead style={styles.thead}>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Type</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Location</th>
            <th style={styles.th}>Images</th>
            <th style={styles.th}></th>
          </tr>
        </thead>
        <tbody>
          {filteredProjects.map((project) => (
            <tr key={project.pid}>
              <td style={styles.td}>#{project.pid}</td>
              <td style={styles.td}>{project.project_name}</td>
              <td style={styles.td}>{project.project_type}</td>
              <td style={styles.td}>
                <button
                  style={{ ...styles.status, ...(project.is_live === 1 ? styles.statusActive : styles.statusInactive) }}
                  onClick={() => toggleProjectStatus(project)}
                >
                  <LiveChip value={project.is_live} />
                </button>
              </td>
              <td style={styles.td}>{project.project_location}</td>
              <td style={styles.td}>
                <div style={{ display: "flex", gap: 8 }}>
                  {project.project_cover_img && <img src={project.project_cover_img} style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 8 }} alt="Cover" />}
                  {project.project_small_img && <img src={project.project_small_img} style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 8 }} alt="Small" />}
                  {project.ovimg && <img src={project.ovimg} style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 8 }} alt="Overview" />}
                </div>
              </td>
              <td style={styles.td}>
                <div style={styles.actionButtons}>
                  <button
                    style={{ ...styles.actionBtn, ...styles.actionView }}
                    onClick={async () => {
                      const d = await fetchProjectDetailsByPid(project.pid);
                      setSelectedProject(d ? { ...project, project_det: d } : project);
                      setShowProjectModal(true);
                    }}
                  >
                    <FiEye size={14} /> View
                  </button>
                  <button style={{ ...styles.actionBtn, ...styles.actionEdit }} onClick={() => editProject(project)}>
                    <FiEdit size={14} /> Edit
                  </button>

                  <button style={{ ...styles.actionBtn, ...styles.actionDelete }} onClick={() => deleteProject(project.pid)}>
                    <FiTrash2 size={14} /> Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }


  return (
    <div style={styles.body}>
      <ToastContainer position="top-right" autoClose={2500} theme="light" />
      <div style={styles.container}>
        <div style={styles.mainContent}>
          <main style={styles.content}>
            <div style={styles.contentHeader}>
              <h2 style={styles.contentTitle}><FaBuilding /> Project Management</h2>
              <div style={styles.headerActions}>
                <button style={{ ...styles.btn, ...styles.btnOutline }} onClick={fetchProjects} disabled={loading}>
                  <FiRefreshCw size={16} /> {!isMobile && "Refresh"}
                </button>
                <button
                  style={{ ...styles.btn, ...styles.btnPrimary }}
                  onClick={() => { resetForm(); setPid(null); setShowModal(true); }}
                >
                  <FiPlus size={16} /> {!isMobile && "Add New Project"}
                </button>
              </div>
            </div>

            {/* Stats */}
            <div style={styles.statsCards}>
              <div style={styles.statCard}>
                <div style={styles.statIcon}><FaBuilding /></div>
                <div style={styles.statValue}>{totalProjects}</div>
                <div style={styles.statLabel}>Total Projects</div>
              </div>
              <div style={styles.statCard}>
                <div style={{ ...styles.statIcon, background: "#5DC350" }}><FaCheck /></div>
                <div style={styles.statValue}>{activeProjects}</div>
                <div style={styles.statLabel}>Active</div>
              </div>
              <div style={styles.statCard}>
                <div style={{ ...styles.statIcon, background: "#3182CE" }}><FiImage /></div>
                <div style={styles.statValue}>{residentialProjects}</div>
                <div style={styles.statLabel}>Residential</div>
              </div>
              <div style={styles.statCard}>
                <div style={{ ...styles.statIcon, background: "#D69E2E" }}><FaBuilding /></div>
                <div style={styles.statValue}>{commercialProjects}</div>
                <div style={styles.statLabel}>Commercial</div>
              </div>
            </div>

            {/* Search & Filters */}
            <div style={styles.searchFilterContainer}>
              <div style={{ position: 'relative', flex: isMobile ? '0 0 100%' : 1, minWidth: isMobile ? 'auto' : '250px' }}>
                <FiSearch style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#718096" }} />
                <input
                  style={styles.searchInput}
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select style={styles.select} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="all">All Status</option>
                <option value="live">Live</option>
                <option value="draft">Draft</option>
              </select>
              <select style={styles.select} value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                <option value="all">All Types</option>
                {projectTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* Table */}
            <div style={styles.tableContainer}>{renderTable()}</div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={styles.pagination}>
                <button style={styles.pageButton} disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                  <FiChevronLeft />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    style={{ ...styles.pageButton, ...(page === i + 1 ? styles.activePage : {}) }}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button style={styles.pageButton} disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
                  <FiChevronRight />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Step 1: Add/Edit Project */}
      {showModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}><FaBuilding /> {editingProject ? "Edit Project" : "Add New Project"}</h3>
              <button style={styles.closeBtn} onClick={() => setShowModal(false)}><FiX /></button>
            </div>

            <div style={styles.modalBody}>
              {/* Left */}
              <div style={styles.modalColumn}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}><FiTag /> Project Name</label>
                  <input style={styles.formControl} name="project_name" value={formData.project_name} onChange={(e) => setFormField("project_name", e.target.value)} />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}><FiKey /> Category ID</label>
                  <select
                    style={styles.formControl}
                    name="pcid"
                    value={formData.pcid}
                    onChange={(e) => setFormField("pcid", e.target.value)}
                  >

                    <option value="">-- Select Category --</option>
                    <option value="1">Ongoing Project</option>
                    <option value="2">Ready to Occupy</option>
                    <option value="3">Completed Project</option>
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}><FiMapPin /> Location</label>
                  <input
                    style={styles.formControl}
                    name="project_location"
                    value={formData.project_location}
                    onChange={(e) => setFormField("project_location", e.target.value)}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}><FiList /> Project Highlights</label>
                  <textarea
                    style={{ ...styles.formControl, ...styles.textarea }}
                    placeholder="Highlights (separate with $)"
                    name="project_highlights"
                    value={formData.project_highlights}
                    onChange={(e) => setFormField("project_highlights", e.target.value)}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}><FiFileText /> Project Overview</label>
                  <textarea
                    style={{ ...styles.formControl, ...styles.textarea }}
                    placeholder="Overview (separate with $)"
                    name="project_overview"
                    value={formData.project_overview}
                    onChange={(e) => setFormField("project_overview", e.target.value)}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}><FiList /> Amenities</label>
                  <textarea
                    style={{ ...styles.formControl, ...styles.textarea }}
                    placeholder="Amenities (separate with $)"
                    name="amenities"
                    value={formData.amenities}
                    onChange={(e) => setFormField("amenities", e.target.value)}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}><FiFileText /> Specification</label>
                  <textarea
                    style={{ ...styles.formControl, ...styles.textarea }}
                    placeholder="Specifications (separate with $)"
                    name="specification"
                    value={formData.specification}
                    onChange={(e) => setFormField("specification", e.target.value)}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}><FiFileText /> Location Advantage</label>
                  <textarea
                    style={{ ...styles.formControl, ...styles.textarea }}
                    placeholder="Location Advantage (separate with $)"
                    name="location_advantage"
                    value={formData.location_advantage}
                    onChange={(e) => setFormField("location_advantage", e.target.value)}
                  />
                </div>

                {/* OG Link Image (file) */}
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}><FiUpload /> OG Link Image</label>
                  <input style={styles.formControl}
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormField("oglink", e.target.files?.[0] ?? null)}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}><FiInfo /> Live Status</label>
                  <select style={styles.formControl} name="is_live" value={String(formData.is_live)} onChange={(e) => setFormField("is_live", Number(e.target.value))}>
                    <option value="0">Draft</option>
                    <option value="1">Live</option>
                  </select>
                </div>
              </div>

              {/* Right */}
              <div style={styles.modalColumn}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}><FiList /> Project Type</label>
                  <select style={styles.formControl} name="project_type" value={formData.project_type} onChange={(e) => setFormField("project_type", e.target.value)}>
                    <option value="">Select Type</option>
                    <option>Residential</option>
                    <option>Commercial</option>
                    <option>Villa</option>
                    <option>Plot</option>
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}><FiInfo /> Project Status (number)</label>
                  <input style={styles.formControl} type="number" name="project_status" value={formData.project_status ?? ""} onChange={(e) => setFormField("project_status", e.target.value)} placeholder="e.g., 0-100" />
                </div>

                {/* Images */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 12 }}>
                  <div style={styles.imageUploadArea}>
                    <label style={{ cursor: "pointer" }}>
                      <FiUpload /> Project Cover Image
                      <input type="file" style={{ display: "none" }} accept="image/*" onChange={(e) => handleImageUpload(e, "project_cover_img")} />
                    </label>
                    {imagePreviews.project_cover_img && (
                      <div style={styles.imagePreviewContainer}>
                        <div style={styles.imagePreviewItem}>
                          <img src={imagePreviews.project_cover_img} style={styles.imagePreviewLarge} alt="Cover" />
                          <button style={styles.removeImageBtn} onClick={() => removeImage("project_cover_img")}>×</button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={styles.imageUploadArea}>
                    <label style={{ cursor: "pointer" }}>
                      <FiUpload /> Project Small Image
                      <input type="file" style={{ display: "none" }} accept="image/*" onChange={(e) => handleImageUpload(e, "project_small_img")} />
                    </label>
                    {imagePreviews.project_small_img && (
                      <div style={styles.imagePreviewContainer}>
                        <div style={styles.imagePreviewItem}>
                          <img src={imagePreviews.project_small_img} style={styles.imagePreviewLarge} alt="Small" />
                          <button style={styles.removeImageBtn} onClick={() => removeImage("project_small_img")}>×</button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={styles.imageUploadArea}>
                    <label style={{ cursor: "pointer" }}>
                      <FiUpload /> Overview Image
                      <input type="file" style={{ display: "none" }} accept="image/*" onChange={(e) => handleImageUpload(e, "ovimg")} />
                    </label>
                    {imagePreviews.ovimg && (
                      <div style={styles.imagePreviewContainer}>
                        <div style={styles.imagePreviewItem}>
                          <img src={imagePreviews.ovimg} style={styles.imagePreviewLarge} alt="Overview" />
                          <button style={styles.removeImageBtn} onClick={() => removeImage("ovimg")}>×</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Attached Brochure */}
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}><FiUpload /> Attached Brochure (PDF/Image)</label>
                  <input style={styles.formControl} type="file" accept=".pdf,image/*"
                    onChange={(e) => setFormField("attached_brochare", e.target.files?.[0] ?? null)} />
                  {typeof formData.attached_brochare === "string" && formData.attached_brochare && (
                    <div style={{ marginTop: 6 }}>
                      <a href={formData.attached_brochare} target="_blank" rel="noreferrer">View current brochure</a>
                    </div>
                  )}
                </div>


                <div style={styles.formGroup}>
                  <label style={styles.formLabel}><FiTag /> Video Link</label>
                  <input style={styles.formControl} name="video_link" value={formData.video_link} onChange={(e) => setFormField("video_link", e.target.value)} />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}><FiTag /> Location Map Link</label>
                  <input style={styles.formControl} name="location_map" value={formData.location_map} onChange={(e) => setFormField("location_map", e.target.value)} />
                </div>

                {/* Location Map (file) */}
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}><FiUpload /> Location Map</label>
                  <input style={styles.formControl} type="file" accept=".pdf,image/*"
                    onChange={(e) => setFormField("location_map", e.target.files?.[0] ?? null)} />
                  {typeof formData.location_map === "string" && formData.location_map && (
                    <div style={{ marginTop: 6 }}>
                      <a href={formData.location_map} target="_blank" rel="noreferrer">View current map</a>
                    </div>
                  )}
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}><FiTag /> Walkthrough Link</label>
                  <input style={styles.formControl} name="walkthrough_link" value={formData.walkthrough_link} onChange={(e) => setFormField("walkthrough_link", e.target.value)} />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}><FiTag /> Get Direction</label>
                  <input style={styles.formControl} name="get_direction" value={formData.get_direction} onChange={(e) => setFormField("get_direction", e.target.value)} />
                </div>
                {/* Page Title */}
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}><FiInfo />Page Title</label>
                  <input
                    style={styles.formControl}
                    name="ptitle"
                    value={formData.ptitle}
                    onChange={(e) => setFormField("ptitle", e.target.value)}
                  />
                </div>

                {/* Meta Description */}
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}><FiInfo />Meta Description</label>
                  <input
                    style={styles.formControl}
                    name="mdesc"
                    value={formData.mdesc}
                    onChange={(e) => setFormField("mdesc", e.target.value)}
                  />
                </div>

                {/* Meta Keywords */}
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}><FiInfo />Meta Keywords</label>
                  <input
                    style={styles.formControl}
                    name="mkeyword"
                    value={formData.mkeyword}
                    onChange={(e) => setFormField("mkeyword", e.target.value)}
                  />
                </div>


              </div>
            </div>

            <div style={styles.modalFooter}>
              {editingProject ? (
                <button style={{ ...styles.btn, ...styles.btnPrimary }} onClick={saveProjectBasicUpdate} disabled={loading}>
                  {loading ? <><FiLoader className="spin" /> Saving…</> : <><FiSave /> Save & Edit Details</>}
                </button>
              ) : (
                <button style={{ ...styles.btn, ...styles.btnPrimary }} onClick={handleNext} disabled={loading}>
                  {loading ? <><FiLoader className="spin" /> Saving…</> : <><FiSave /> Save & Add Details</>}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Details */}
      {showDetailsModal && pid && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}><FiFileText /> Project Details (PID: {pid})</h3>
              <button style={styles.closeBtn} onClick={() => setShowDetailsModal(false)}><FiX /></button>
            </div>

            <div style={styles.modalBody}>
              {/* Left */}
              <div style={styles.modalColumn}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}><FiFileText /> Plan Name</label>
                  <input style={styles.formControl} name="plan_name" value={details.plan_name} onChange={handleDetailChange} />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}><FiFileText /> Flat Details</label>
                  <input style={styles.formControl} placeholder="Flat Details (separate with $)" name="flat_det" value={details.flat_det} onChange={handleDetailChange} />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}><FiUpload /> Flats Image</label>
                  <input key={`flat_img-${resetKey}`} type="file" style={styles.formControl} name="flat_img" multiple onChange={handleDetailChange} />
                </div>

                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <div key={i} style={{ marginBottom: 12, background: "#fcf8f2", borderRadius: 8, padding: 10 }}>
                    <label style={styles.formLabel}>{`Gallery Type ${i}`}</label>
                    <input style={styles.formControl} placeholder={`Type ${i}`} name={`gtype${i}`} value={details[`gtype${i}`]} onChange={handleDetailChange} />
                    <input style={styles.formControl} placeholder={`Type ${i} Details (separate with $)`} name={`gtype${i}_det`} value={details[`gtype${i}_det`]} onChange={handleDetailChange} />
                    {/* inside the gallery block for index i */}
                    {existingDetail?.[`gtype${i}_img`] && (
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "8px 0" }}>
                        {String(existingDetail[`gtype${i}_img`])
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean)
                          .map((src, k) => (
                            <img key={k} src={src} alt={`g${i}-${k}`} style={styles.thumb}
                              onClick={() => showImage(src)} />
                          ))}
                      </div>
                    )}
                    <input key={`gtype${i}_img-${resetKey}`} type="file" style={styles.formControl} name={`gtype${i}_img`} multiple onChange={handleDetailChange} />
                  </div>
                ))}
              </div>

              {/* Right */}
              <div style={styles.modalColumn}>
                {[8, 9, 10].map((i) => (
                  <div key={i} style={{ marginBottom: 12, background: "#fcf8f2", borderRadius: 8, padding: 10 }}>
                    <label style={styles.formLabel}>{`Gallery Type ${i}`}</label>
                    <input style={styles.formControl} placeholder={`Type ${i}`} name={`gtype${i}`} value={details[`gtype${i}`]} onChange={handleDetailChange} />
                    <input style={styles.formControl} placeholder={`Type ${i} Details (separate with $)`} name={`gtype${i}_det`} value={details[`gtype${i}_det`]} onChange={handleDetailChange} />
                    {/* inside the gallery block for index i */}
                    {existingDetail?.[`gtype${i}_img`] && (
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "8px 0" }}>
                        {String(existingDetail[`gtype${i}_img`])
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean)
                          .map((src, k) => (
                            <img key={k} src={src} alt={`g${i}-${k}`} style={styles.thumb}
                              onClick={() => showImage(src)} />
                          ))}
                      </div>
                    )}
                    <input key={`gtype${i}_img-${resetKey}`} type="file" style={styles.formControl} name={`gtype${i}_img`} multiple onChange={handleDetailChange} />
                  </div>
                ))}

                {/* Area / Specs / Payment — placeholders mention `$` */}
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Market Price</label>
                  <input style={styles.formControl} placeholder="Market Price" name="area_market_price" value={details.area_market_price} onChange={handleDetailChange} />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Our Price</label>
                  <input style={styles.formControl} placeholder="Our Price" name="area_our_price" value={details.area_our_price} onChange={handleDetailChange} />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Flat Numbers</label>
                  <input style={styles.formControl} placeholder="Flat Numbers (separate with $)" name="area_flat_number" value={details.area_flat_number} onChange={handleDetailChange} />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Total Sqft</label>
                  <input style={styles.formControl} placeholder="Total Sqft (separate with $)" name="area_total_sqft" value={details.area_total_sqft} onChange={handleDetailChange} />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>No of BHK</label>
                  <input style={styles.formControl} placeholder="No of BHK (separate with $)" name="area_noofbhk" value={details.area_noofbhk} onChange={handleDetailChange} />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Specification Left</label>
                  <textarea style={{ ...styles.formControl, ...styles.textarea }} placeholder="Specification Left (separate with $)" name="property_specification_left" value={details.property_specification_left} onChange={handleDetailChange} />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Specification Right</label>
                  <textarea style={{ ...styles.formControl, ...styles.textarea }} placeholder="Specification Right (separate with $)" name="property_specification_right" value={details.property_specification_right} onChange={handleDetailChange} />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Payment Details</label>
                  <textarea style={{ ...styles.formControl, ...styles.textarea }} placeholder="Payment Details (separate with $)" name="ps_details" value={details.ps_details} onChange={handleDetailChange} />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Payment Schedule</label>
                  <textarea style={{ ...styles.formControl, ...styles.textarea }} placeholder="Payment Schedule (separate with $)" name="ps_payment" value={details.ps_payment} onChange={handleDetailChange} />
                </div>
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button style={{ ...styles.btn, ...styles.btnPrimary }} onClick={handleDetailsSave} disabled={loading}>
                {loading ? <><FiLoader className="spin" /> Saving…</> : <><FiSave /> Save Details</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW PROJECT (basic + details + images) */}
      {showProjectModal && selectedProject && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={{ ...styles.modalHeader, background: "linear-gradient(135deg,#E36324 0%,#FF7B42 100%)" }}>
              <h3 style={styles.modalTitle}><FiInfo /> {selectedProject.project_name}</h3>
              <button style={styles.closeBtn} onClick={() => setShowProjectModal(false)}><FiX /></button>
            </div>

            <div style={{ ...styles.modalBody, flexDirection: "column", gap: 16 }}>
              {/* ===== BASIC INFO ===== */}
              <div style={{ ...styles.projectWrap }}>
                <div
                  style={{
                    marginBottom: 4,
                    padding: 16,
                    background: "#F7FAFC",
                    borderRadius: 8,
                    border: "1px solid #E2E8F0",
                  }}
                >
                  <div style={styles.projectField}>
                    <FiTag style={styles.projectIcon} />
                    <div>
                      <div style={styles.projectLabel}>Name</div>
                      <div style={styles.projectValue}>{selectedProject.project_name || "-"}</div>
                    </div>
                  </div>

                  <div style={styles.projectField}>
                    <FiKey style={styles.projectIcon} />
                    <div>
                      <div style={styles.projectLabel}>Category ID</div>
                      <div style={styles.projectValue}>{selectedProject.pcid}</div>
                    </div>
                  </div>

                  <div style={styles.projectField}>
                    <FiLayers style={styles.projectIcon} />
                    <div>
                      <div style={styles.projectLabel}>Type</div>
                      <div style={styles.projectValue}>{selectedProject.project_type || "-"}</div>
                    </div>
                  </div>

                  <div style={styles.projectField}>
                    <FiMapPin style={styles.projectIcon} />
                    <div>
                      <div style={styles.projectLabel}>Location</div>
                      <div style={styles.projectValue}>{selectedProject.project_location || "-"}</div>
                    </div>
                  </div>

                  <div style={styles.projectField}>
                    <FiCheckCircle style={styles.projectIcon} />
                    <div>
                      <div style={styles.projectLabel}>Live Status</div>
                      <div
                        style={{
                          background:
                            (selectedProject.is_live === 1 ||
                              selectedProject.is_live === "1" ||
                              selectedProject.is_live === true)
                              ? "#dff9e6"
                              : "#e0e0e0",
                          color:
                            (selectedProject.is_live === 1 ||
                              selectedProject.is_live === "1" ||
                              selectedProject.is_live === true)
                              ? "#009b48"
                              : "#637381",
                          borderRadius: 8,
                          padding: "2px 10px",
                          display: "inline-block",
                          fontWeight: 600,
                        }}
                      >
                        {(selectedProject.is_live === 1 ||
                          selectedProject.is_live === "1" ||
                          selectedProject.is_live === true)
                          ? "Live"
                          : "Draft"}
                      </div>
                    </div>
                  </div>

                  {(selectedProject.project_highlights || selectedProject.project_overview) && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 8 }}>
                      {!!selectedProject.project_highlights && (
                        <div style={{ background: "#fff", border: "1px solid #F1F5F9", borderRadius: 8, padding: 12 }}>
                          <h5 style={{ margin: 0, marginBottom: 6,  color: '#2D3748',fontSize: '15px',fontWeight: 700 }}>Highlights</h5>
                          <ul style={{ paddingLeft: 18, margin: 0 }}>
                            {splitDollar(selectedProject.project_highlights).map((t, i) => <li key={i}>{t}</li>)}
                          </ul>
                        </div>
                      )}
                      {!!selectedProject.project_overview && (
                        <div style={{ background: "#fff", border: "1px solid #F1F5F9", borderRadius: 8, padding: 12 }}>
                          <h5 style={{ margin: 0, marginBottom: 6,  color: '#2D3748',fontSize: '15px', fontWeight: 700 }}>Overview</h5>
                          <ul style={{ paddingLeft: 18, margin: 0 }}>
                            {splitDollar(selectedProject.project_overview).map((t, i) => <li key={i}>{t}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Basic images row */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginTop: 12 }}>
                    <div>
                      <div style={styles.projectLabel}>Cover Image</div>
                      {selectedProject.project_cover_img && (
                        <img
                          src={selectedProject.project_cover_img}
                          alt="Cover"
                          style={{ ...styles.thumb, width: 170, height: 110 }}
                          onClick={() => showImage?.(selectedProject.project_cover_img)}
                        />
                      )}
                    </div>
                    <div>
                      <div style={styles.projectLabel}>Small Image</div>
                      {selectedProject.project_small_img && (
                        <img
                          src={selectedProject.project_small_img}
                          alt="Small"
                          style={{ ...styles.thumb, width: 170, height: 110 }}
                          onClick={() => showImage?.(selectedProject.project_small_img)}
                        />
                      )}
                    </div>
                    <div>
                      <div style={styles.projectLabel}>Overview Image</div>
                      {selectedProject.ovimg && (
                        <img
                          src={selectedProject.ovimg}
                          alt="Overview"
                          style={{ ...styles.thumb, width: 170, height: 110 }}
                          onClick={() => showImage?.(selectedProject.ovimg)}
                        />
                      )}
                    </div>
                  </div>

                  {selectedProject.attached_brochare && (
                    <div style={{ marginTop: 12 }}>
                      <div style={styles.projectLabel}>Brochure</div>
                      <a href={selectedProject.attached_brochare} target="_blank" rel="noreferrer">
                        {selectedProject.attached_brochare}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* ===== DETAILS (from project_det) ===== */}
              {Array.isArray(selectedProject.project_det) && selectedProject.project_det.length > 0 && (
                <div style={styles.projectWrap}>
                  {selectedProject.project_det.map((d, idx) => (
                    <div key={d.pdid || idx} style={styles.detailCard}>
                      <h4 style={{ margin: "0 0 10px", color: "#B45309" }}>
                        Project Details {selectedProject.project_det.length > 1 ? `#${idx + 1}` : ""}
                      </h4>

                      {/* Plan / Flats */}
                      <div style={styles.detailGrid2}>
                        <div style={styles.kvBlock}>
                          <div style={styles.kvTitle}>Plan Name</div>
                          <div>{d.plan_name || "-"}</div>
                        </div>
                        <div style={styles.kvBlock}>
                          <div style={styles.kvTitle}>Flat Details</div>
                          <ul style={{ margin: 0, paddingLeft: 18 }}>
                            {splitDollar(d.flat_det).map((t, i) => <li key={i}>{t}</li>)}
                          </ul>
                        </div>
                      </div>

                      {/* Flat Images */}
                      {splitComma(d.flat_img).length > 0 && (
                        <div style={{ marginTop: 12 }}>
                          <div style={styles.kvTitle}>Flat Images</div>
                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            {splitComma(d.flat_img).map((src, i) => (
                              <img
                                key={i}
                                src={src}
                                alt={`flat-${i}`}
                                style={styles.thumb}
                                // onClick={() => showImage?.(src)}
                                onClick={() => showImage(src)}

                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Gallery Types 1..10 */}
                      <div style={{ ...styles.detailGrid2, marginTop: 12 }}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => {
                          const t = d[`gtype${n}`];
                          const det = d[`gtype${n}_det`];
                          const imgs = d[`gtype${n}_img`];
                          const detList = Array.isArray(det) ? det : splitDollar(det);
                          const imgList = Array.isArray(imgs) ? imgs : splitComma(imgs);
                          const hasAny = t || detList.length || imgList.length;
                          if (!hasAny) return null;

                          return (
                            <div key={n} style={styles.kvBlock}>
                              <div style={styles.galleryTitle}>{t || `Gallery Type ${n}`}</div>
                              {detList.length > 0 && (
                                <ul style={{ margin: 0, paddingLeft: 18 }}>
                                  {detList.map((x, i) => <li key={i}>{x}</li>)}
                                </ul>
                              )}
                              {imgList.length > 0 && (
                                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
                                  {imgList.map((src, i) => (
                                    <img
                                      key={i}
                                      src={src}
                                      alt={`g${n}-${i}`}
                                      style={styles.thumb}
                                      // onClick={() => showImage?.(src)}
                                      onClick={() => showImage(src)}

                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Area / Specs / Payment */}
                      <div style={{ ...styles.detailGrid3, marginTop: 12 }}>
                        <div style={styles.kvBlock}>
                          <div style={styles.kvTitle}>Market Price</div>
                          <div>{d.area_market_price || "-"}</div>
                        </div>
                        <div style={styles.kvBlock}>
                          <div style={styles.kvTitle}>Our Price</div>
                          <div>{d.area_our_price || "-"}</div>
                        </div>
                        <div style={styles.kvBlock}>
                          <div style={styles.kvTitle}>No. of BHK</div>
                          <div>{d.area_noofbhk || "-"}</div>
                        </div>
                      </div>

                      <div style={{ ...styles.detailGrid3, marginTop: 12 }}>
                        <div style={styles.kvBlock}>
                          <div style={styles.kvTitle}>Flat Numbers</div>
                          <ul style={{ margin: 0, paddingLeft: 18 }}>
                            {splitDollar(d.area_flat_number).map((t, i) => <li key={i}>{t}</li>)}
                          </ul>
                        </div>
                        <div style={styles.kvBlock}>
                          <div style={styles.kvTitle}>Total Sqft</div>
                          <ul style={{ margin: 0, paddingLeft: 18 }}>
                            {splitDollar(d.area_total_sqft).map((t, i) => <li key={i}>{t}</li>)}
                          </ul>
                        </div>
                        <div style={styles.kvBlock}>
                          <div style={styles.kvTitle}>Payment Schedule</div>
                          <ul style={{ margin: 0, paddingLeft: 18 }}>
                            {splitDollar(d.ps_payment).map((t, i) => <li key={i}>{t}</li>)}
                          </ul>
                        </div>
                      </div>

                      <div style={{ ...styles.detailGrid2, marginTop: 12 }}>
                        <div style={styles.kvBlock}>
                          <div style={styles.kvTitle}>Specification (Left)</div>
                          <ul style={{ margin: 0, paddingLeft: 18 }}>
                            {splitDollar(d.property_specification_left).map((t, i) => <li key={i}>{t}</li>)}
                          </ul>
                        </div>
                        <div style={styles.kvBlock}>
                          <div style={styles.kvTitle}>Specification (Right)</div>
                          <ul style={{ margin: 0, paddingLeft: 18 }}>
                            {splitDollar(d.property_specification_right).map((t, i) => <li key={i}>{t}</li>)}
                          </ul>
                        </div>
                      </div>

                      {splitDollar(d.ps_details).length > 0 && (
                        <div style={{ marginTop: 12 }}>
                          <div style={styles.kvTitle}>Payment Details</div>
                          <ul style={{ margin: 0, paddingLeft: 18 }}>
                            {splitDollar(d.ps_details).map((t, i) => <li key={i}>{t}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={styles.modalFooter}>
              <button style={{ ...styles.btn, ...styles.btnOutline }} onClick={() => setShowProjectModal(false)}>
                <FiX /> Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ===== FULL SCREEN IMAGE PREVIEW ===== */}
      {imagePreview && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.75)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999999,
          }}
          onClick={closeImage}
        >
          <img
            src={imagePreview}
            alt=""
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              borderRadius: 10,
              boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
              background: "#fff",
            }}
          />
        </div>
      )}



    </div>
  );
};

export default ProjectDashboard;
