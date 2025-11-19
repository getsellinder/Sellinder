import React, { useState, useEffect } from "react";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import toast from "react-hot-toast";

const HistoryDashboardPage = () => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  const [analyses, setAnalyses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);

  useEffect(() => {
    fetchAnalyses(currentPage);
  }, [currentPage]);

  // Helper functions from chrome extension
  function extractNameFromAnalysis(obj) {
    if (!obj || typeof obj !== 'object') return '';
    const bannedProfileStrings = ['linkedin profile', 'linkedin profile analysis', 'analyzed profile', 'analysis', 'analysis report', 'analysis result'];
    
    const tryFields = [
      obj.executiveSummary?.profileName,
      obj.analysis?.executiveSummary?.profileName,
      obj.profile?.name,
      obj.profileName,
      obj.profile?.profileName,
      obj.analyzedName,
      obj.name,
      obj.reportName,
      obj.analysisName,
      obj.analysis?.profile?.name,
      obj.analysis?.profileName,
      obj.analysis?.analyzedName,
      obj.analysis?.name,
      obj.analysis?.analysis?.profileName,
      obj.analysis?.analysis?.name,
      obj.analysis?.result?.profileName,
      obj.analysis?.result?.name,
      obj.result?.profileName,
      obj.result?.name
    ];
    
    for (const f of tryFields) {
      if (f && typeof f === 'string') {
        const v = f.trim();
        if (v && !bannedProfileStrings.includes(v.toLowerCase())) return v;
      }
    }
    return '';
  }

  function extractPostsAnalyzed(item) {
    if (!item) return 0;
    const candidates = [
      item.analysisMetadata?.postsAnalyzed,
      item.postAnalysis?.totalPosts,
      item.analysis?.analysisMetadata?.postsAnalyzed,
      item.analysis?.postAnalysis?.totalPosts,
      item.postsCount,
      item.posts?.length
    ];
    for (const c of candidates) {
      if (Number.isFinite(Number(c))) return Number(c);
      if (Array.isArray(c)) return c.length;
    }
    return 0;
  }

  const fetchAnalyses = async (page = 1) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        toast.error("Please login to view your analysis history.");
        setIsLoading(false);
        return;
      }

      // First, get user ID from the user details API
      let userId = null;
      try {
        const userDetailsRes = await fetch(`${url}/api/v1/user/details`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        
        if (userDetailsRes.ok) {
          const userData = await userDetailsRes.json();
          console.log("User details response:", userData);
          
          // Try multiple possible locations for the user ID
          userId = userData?.id || 
                   userData?._id || 
                   userData?.data?.id || 
                   userData?.data?._id ||
                   userData?.user?.id ||
                   userData?.user?._id;
          
          console.log("Extracted userId:", userId);
        } else {
          console.error("User details request failed with status:", userDetailsRes.status);
        }
      } catch (err) {
        console.error("Error fetching user details:", err);
      }
      
      if (!userId) {
        console.error("User ID not found after checking all possible fields");
        toast.error("Unable to retrieve user information. Please try logging in again.");
        setIsLoading(false);
        return;
      }

      const apiUrl = `${url}/api/linked/disc/user/${userId}?page=${page}&limit=10`;

      const res = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        
        let analysesData = [];
        if (Array.isArray(data)) {
          analysesData = data;
        } else if (data.data && Array.isArray(data.data)) {
          analysesData = data.data;
        } else if (data.analyses && Array.isArray(data.analyses)) {
          analysesData = data.analyses;
        }
        
        // Extract pagination info from API response
        setTotalPages(data.totalPages || 1);
        setTotalCount(data.total || analysesData.length);
        setAnalyses(analysesData);
      } else {
        const errorData = await res.json();
        console.error("Error response:", errorData);
        toast.error(errorData.message || "Failed to fetch analysis history");
      }
    } catch (err) {
      console.error("Error fetching analyses:", err);
      toast.error("Error loading history");
    } finally {
      setIsLoading(false);
    }
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      toast.error(`Page ${page} not found. Redirecting to page 1.`);
      setCurrentPage(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePageInput = (e) => {
    if (e.key === 'Enter') {
      const pageNum = parseInt(e.target.value);
      if (isNaN(pageNum) || pageNum < 1 || pageNum > totalPages) {
        toast.error(`Invalid page number. Redirecting to page 1.`);
        setCurrentPage(1);
        e.target.value = '';
      } else {
        setCurrentPage(pageNum);
        e.target.value = '';
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (selectedAnalysis) {
    // Extract report data from various possible locations
    const rawReport = selectedAnalysis.analysis || selectedAnalysis;
    const report = {
      // Profile info
      profile: rawReport.profile || selectedAnalysis.profile || {},
      profileName: extractNameFromAnalysis(rawReport) || extractNameFromAnalysis(selectedAnalysis),
      
      // Product info
      productDescription: rawReport.productDescription || selectedAnalysis.productDescription || "",
      productPrice: rawReport.productPrice || selectedAnalysis.productPrice || "",
      
      // Personality/DISC
      personality: rawReport.personality || selectedAnalysis.personality || {},
      
      // All other sections - check both rawReport and selectedAnalysis
      talkingPoints: rawReport.talkingPoints || selectedAnalysis.talkingPoints || [],
      openingScripts: rawReport.openingScripts || selectedAnalysis.openingScripts || null,
      executiveSummary: rawReport.executiveSummary || selectedAnalysis.executiveSummary || "",
      quickSummary: rawReport.quickSummary || selectedAnalysis.quickSummary || null,
      personalizationCues: rawReport.personalizationCues || selectedAnalysis.personalizationCues || rawReport.recentPostInsights || selectedAnalysis.recentPostInsights || [],
      recentPostInsights: rawReport.recentPostInsights || selectedAnalysis.recentPostInsights || [],
      commonGroundAndSharedVision: rawReport.commonGroundAndSharedVision || selectedAnalysis.commonGroundAndSharedVision || null,
      personalOpinions: rawReport.personalOpinions || selectedAnalysis.personalOpinions || [],
      analysisMetadata: rawReport.analysisMetadata || selectedAnalysis.analysisMetadata || null,
      communicationStrategy: rawReport.communicationStrategy || selectedAnalysis.communicationStrategy || [],
      objectionHandling: rawReport.objectionHandling || selectedAnalysis.objectionHandling || [],
      probabilityToPurchase: rawReport.probabilityToPurchase || selectedAnalysis.probabilityToPurchase || null,
      actionableMetrics: rawReport.actionableMetrics || selectedAnalysis.actionableMetrics || null,
      likes: rawReport.likes || selectedAnalysis.likes || [],
      dislikes: rawReport.dislikes || selectedAnalysis.dislikes || [],
      detailedPostMetrics: rawReport.detailedPostMetrics || selectedAnalysis.detailedPostMetrics || null,
      confidenceExplanation: rawReport.confidenceExplanation || selectedAnalysis.confidenceExplanation || null,
      companyOverview: rawReport.companyOverview || selectedAnalysis.companyOverview || null,
      dataSources: rawReport.dataSources || selectedAnalysis.dataSources || [],
      recommendedApproach: rawReport.recommendedApproach || selectedAnalysis.recommendedApproach || "",
      nextSteps: rawReport.nextSteps || selectedAnalysis.nextSteps || []
    };
    
    const profileName = report.profileName || report.profile?.name || "Unknown Profile";
    const profileCompany = report.profile?.company || "";
    const profileLocation = report.profile?.location || "";
    const productDescription = report.productDescription;
    const productPrice = report.productPrice;
    
    const disc = report.personality?.disc || {};
    const d = disc.dominance ?? disc.D ?? disc.d ?? 0;
    const i = disc.influence ?? disc.I ?? disc.i ?? 0;
    const s = disc.steadiness ?? disc.S ?? disc.s ?? 0;
    const c = disc.conscientiousness ?? disc.C ?? disc.c ?? 0;
    
    const primaryType = report.personality?.primaryType || "";
    const secondaryType = report.personality?.secondaryType || "";
    
    console.log("Full report data:", report); // Debug log to see what data is available
    
    return (
      <DashboardLayout>
        {() => (
          <div className="space-y-6 max-w-5xl mx-auto pb-8">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setSelectedAnalysis(null)}
                className="text-sky-600 hover:text-sky-700 font-medium flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                Back to History
              </button>
              
              <h1 className="text-2xl font-bold text-gray-900">Full Analysis Report</h1>
              <div className="w-32"></div>
            </div>

            {/* Product Description */}
            {productDescription && (
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <h3 className="font-semibold text-gray-900">Product Description</h3>
                </div>
                <div className="text-sm text-gray-700 mb-3 whitespace-pre-line">{productDescription}</div>
                {productPrice && (
                  <>
                    <div className="text-sm font-medium text-gray-900 mb-1">Price:</div>
                    <div className="text-lg text-orange-600 font-semibold">{productPrice}</div>
                  </>
                )}
              </div>
            )}

            {/* Executive Summary */}
            {report.executiveSummary && (
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="font-semibold text-gray-900">Executive Summary</h3>
                </div>
                {typeof report.executiveSummary === 'string' ? (
                  <div className="text-sm text-gray-700 whitespace-pre-line">{report.executiveSummary}</div>
                ) : typeof report.executiveSummary === 'object' ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <tbody>
                        {Object.entries(report.executiveSummary).map(([key, value]) => (
                          <tr key={key} className="border-b border-gray-100">
                            <td className="px-3 py-2 font-semibold text-gray-700 bg-gray-50 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </td>
                            <td className="px-3 py-2 text-gray-700">
                              {typeof value === 'object' ? JSON.stringify(value) : String(value || '—')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : null}
              </div>
            )}

            {/* DISC Profile */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h3 className="font-semibold text-gray-900">DISC Profile</h3>
              </div>
              <div className="grid grid-cols-4 gap-2 mb-4">
                <div className="text-center p-2 bg-blue-50 rounded">
                  <div className="text-sm font-bold text-blue-600">{d}%</div>
                  <div className="text-xs font-semibold text-blue-700">Dominance</div>
                </div>
                <div className="text-center p-2 bg-green-50 rounded">
                  <div className="text-sm font-bold text-green-600">{i}%</div>
                  <div className="text-xs font-semibold text-green-700">Influence</div>
                </div>
                <div className="text-center p-2 bg-yellow-50 rounded">
                  <div className="text-sm font-bold text-yellow-600">{s}%</div>
                  <div className="text-xs font-semibold text-amber-700">Steadiness</div>
                </div>
                <div className="text-center p-2 bg-purple-50 rounded">
                  <div className="text-sm font-bold text-purple-600">{c}%</div>
                  <div className="text-xs font-semibold text-purple-700">Conscientiousness</div>
                </div>
              </div>
              {(primaryType || secondaryType) && (
                <div className="text-sm text-gray-700 mb-3">
                  Primary: {primaryType || "N/A"} • Secondary: {secondaryType || "N/A"}
                </div>
              )}
            </div>

            {/* Talking Points */}
            {Array.isArray(report.talkingPoints) && report.talkingPoints.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <h3 className="font-semibold text-gray-900">Talking Points</h3>
                </div>
                <ul className="space-y-2">
                  {report.talkingPoints.map((tp, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="text-sm text-gray-700">{typeof tp === 'string' ? tp : tp.topic || ''}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Opening Scripts */}
            {report.openingScripts && (
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <h3 className="font-semibold text-gray-900">Opening Scripts</h3>
                </div>
                <div className="space-y-3">
                  {Array.isArray(report.openingScripts.linkedin_dm) && report.openingScripts.linkedin_dm.length > 0 && (
                    <div>
                      <div className="text-xs font-medium text-gray-700 mb-1">LinkedIn DM</div>
                      <ul className="space-y-2">
                        {report.openingScripts.linkedin_dm.map((m, i) => (
                          <li key={i} className="text-sm text-gray-700 bg-gray-50 p-2 rounded">{m}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {Array.isArray(report.openingScripts.email) && report.openingScripts.email.length > 0 && (
                    <div>
                      <div className="text-xs font-medium text-gray-700 mb-1">Email</div>
                      <ul className="space-y-2">
                        {report.openingScripts.email.map((e, i) => (
                          <li key={i} className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                            <div className="font-medium">{e.subject}</div>
                            <div className="text-gray-600 text-sm whitespace-pre-line mt-1">{e.body}</div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {report.openingScripts.phone && (
                    <div className="text-sm text-gray-700"><span className="text-xs font-medium text-gray-700">Phone: </span>{report.openingScripts.phone}</div>
                  )}
                  {report.openingScripts.whatsapp && (
                    <div className="text-sm text-gray-700"><span className="text-xs font-medium text-gray-700">WhatsApp: </span>{report.openingScripts.whatsapp}</div>
                  )}
                </div>
              </div>
            )}

            {/* Quick Summary */}
            {report.quickSummary && (
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <h3 className="font-semibold text-gray-900">Quick Summary</h3>
                </div>
                <div className="text-sm text-gray-700 space-y-2">
                  {report.quickSummary.who && (
                    <div><span className="font-semibold">Who:</span> {report.quickSummary.who}</div>
                  )}
                  {report.quickSummary.primaryDISC && (
                    <div><span className="font-semibold">Primary DISC:</span> {report.quickSummary.primaryDISC}</div>
                  )}
                  {Array.isArray(report.quickSummary.topTalkingPoints) && report.quickSummary.topTalkingPoints.length > 0 && (
                    <div>
                      <div className="font-semibold mb-1">Top Talking Points:</div>
                      <ul className="ml-4 space-y-1">
                        {report.quickSummary.topTalkingPoints.map((p, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {report.quickSummary.bestOutreachChannel && (
                    <div><span className="font-semibold">Best Channel:</span> {report.quickSummary.bestOutreachChannel}</div>
                  )}
                  {report.quickSummary.preferredTone && (
                    <div><span className="font-semibold">Preferred Tone:</span> {report.quickSummary.preferredTone}</div>
                  )}
                </div>
              </div>
            )}

            {/* Personalization Cues */}
            {((Array.isArray(report.personalizationCues) && report.personalizationCues.length > 0) || 
              (Array.isArray(report.recentPostInsights) && report.recentPostInsights.length > 0)) && (
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <h3 className="font-semibold text-gray-900">Personalization Cues</h3>
                </div>
                <ul className="space-y-2">
                  {(report.personalizationCues || report.recentPostInsights || []).map((insight, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700">{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Common Ground */}
            {report.commonGroundAndSharedVision && (
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <h3 className="font-semibold text-gray-900">Common Ground & Shared Vision</h3>
                </div>
                {Array.isArray(report.commonGroundAndSharedVision.areas) && report.commonGroundAndSharedVision.areas.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                          <th className="px-3 py-2 bg-gray-100">Area</th>
                          <th className="px-3 py-2 bg-gray-100">Commonality</th>
                        </tr>
                      </thead>
                      <tbody>
                        {report.commonGroundAndSharedVision.areas.map((a, i) => (
                          <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                            <td className="px-3 py-3 font-medium text-gray-900">{a.area || '—'}</td>
                            <td className="px-3 py-3 text-gray-700 whitespace-pre-line">{a.commonality || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {report.commonGroundAndSharedVision.salesInsight && (
                  <div className="mt-3 p-3 bg-gray-50 border border-gray-100 rounded">
                    <div className="text-xs font-semibold text-gray-700 mb-1">Sales Insight</div>
                    <div className="text-sm text-gray-700 whitespace-pre-line">{report.commonGroundAndSharedVision.salesInsight}</div>
                  </div>
                )}
              </div>
            )}

            {/* Personal Opinions */}
            {Array.isArray(report.personalOpinions) && report.personalOpinions.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <h3 className="font-semibold text-gray-900">Their Opinions & Views</h3>
                </div>
                <ul className="space-y-2">
                  {report.personalOpinions.map((opinion, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700 italic">{opinion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Analysis Metadata */}
            {report.analysisMetadata && (
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <h3 className="font-semibold text-gray-900">Analysis Metadata</h3>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="text-center p-2 bg-blue-50 rounded">
                    <div className="text-lg font-bold text-blue-600">{report.analysisMetadata?.profileFieldsUsed ?? 0}</div>
                    <div className="text-xs text-gray-600">Profile Fields Used</div>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded">
                    <div className="text-lg font-bold text-green-600">{extractPostsAnalyzed(report)}</div>
                    <div className="text-xs text-gray-600">Posts Analyzed</div>
                  </div>
                </div>
                {report.analysisMetadata?.writingTone && (
                  <div className="text-sm text-gray-700 mb-2">
                    <span className="font-semibold">Writing Tone:</span> {report.analysisMetadata.writingTone}
                  </div>
                )}
                {Array.isArray(report.analysisMetadata?.dominantTopics) && report.analysisMetadata.dominantTopics.length > 0 && (
                  <div>
                    <div className="text-xs font-medium text-gray-700 mb-2">Dominant Topics:</div>
                    <div className="flex flex-wrap gap-1">
                      {report.analysisMetadata.dominantTopics.map((topic, index) => (
                        <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Communication Strategy */}
            {Array.isArray(report.communicationStrategy) && report.communicationStrategy.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h3 className="font-semibold text-gray-900">Communication Strategy</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        <th className="px-3 py-2 bg-gray-100">Day</th>
                        <th className="px-3 py-2 bg-gray-100">Channel</th>
                        <th className="px-3 py-2 bg-gray-100">Objective</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.communicationStrategy.map((step, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                          <td className="px-3 py-3 font-medium text-gray-900">{step.day ? `Day ${step.day}` : '—'}</td>
                          <td className="px-3 py-3 text-gray-700">{step.channel || '—'}</td>
                          <td className="px-3 py-3 text-gray-700 whitespace-pre-line">{step.objective || step.goal || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Objection Handling */}
            {Array.isArray(report.objectionHandling) && report.objectionHandling.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <h3 className="font-semibold text-gray-900">Objection Handling</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        <th className="px-3 py-2 bg-gray-100">Objection</th>
                        <th className="px-3 py-2 bg-gray-100">Response</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.objectionHandling.map((item, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                          <td className="px-3 py-3 font-medium text-gray-900">{item.objection || '—'}</td>
                          <td className="px-3 py-3 text-gray-700 whitespace-pre-line">{item.recommendedResponse || item.response || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Probability to Purchase */}
            {report.probabilityToPurchase && (
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <h3 className="font-semibold text-gray-900">Probability to Purchase</h3>
                </div>
                {report.probabilityToPurchase.predictedOutcome && (
                  <div className="mb-3 p-3 bg-purple-50 rounded">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl font-bold text-purple-600">
                        {report.probabilityToPurchase.predictedOutcome.percentage || '—'}
                      </span>
                      <span className="text-sm text-gray-600">
                        ({report.probabilityToPurchase.predictedOutcome.category || '—'})
                      </span>
                    </div>
                    {report.probabilityToPurchase.predictedOutcome.description && (
                      <div className="text-sm text-gray-700">
                        {report.probabilityToPurchase.predictedOutcome.description}
                      </div>
                    )}
                  </div>
                )}
                {Array.isArray(report.probabilityToPurchase.factors) && report.probabilityToPurchase.factors.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                          <th className="px-3 py-2 bg-gray-100">Factor</th>
                          <th className="px-3 py-2 bg-gray-100">Influence</th>
                          <th className="px-3 py-2 bg-gray-100">Impact</th>
                        </tr>
                      </thead>
                      <tbody>
                        {report.probabilityToPurchase.factors.map((f, i) => (
                          <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                            <td className="px-3 py-3 font-medium text-gray-900">{f.factor || '—'}</td>
                            <td className="px-3 py-3">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                f.influence === 'High' ? 'bg-red-100 text-red-700' :
                                f.influence === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-green-100 text-green-700'
                              }`}>
                                {f.influence || '—'}
                              </span>
                            </td>
                            <td className="px-3 py-3 text-gray-700">{f.impact || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Actionable Metrics */}
            {report.actionableMetrics && (
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  <h3 className="font-semibold text-gray-900">Actionable Metrics</h3>
                </div>
                <div className="space-y-3 text-sm text-gray-700">
                  {report.actionableMetrics.responseRateTarget && (
                    <div>
                      <span className="font-semibold">Response Rate Target:</span> {report.actionableMetrics.responseRateTarget}
                    </div>
                  )}
                  {Array.isArray(report.actionableMetrics.followUpCadence) && report.actionableMetrics.followUpCadence.length > 0 && (
                    <div>
                      <div className="font-semibold mb-2">Follow-up Cadence:</div>
                      <ol className="ml-4 space-y-1 list-decimal">
                        {report.actionableMetrics.followUpCadence.map((step, i) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  )}
                  {Array.isArray(report.actionableMetrics.engagementMilestones) && report.actionableMetrics.engagementMilestones.length > 0 && (
                    <div>
                      <div className="font-semibold mb-2">Engagement Milestones:</div>
                      <ul className="ml-4 space-y-1">
                        {report.actionableMetrics.engagementMilestones.map((milestone, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                            <span>{milestone}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Likes and Dislikes */}
            {(report.likes || report.dislikes) && (
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <h3 className="font-semibold text-gray-900">Likes & Dislikes</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {Array.isArray(report.likes) && report.likes.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                        </svg>
                        <span className="text-sm font-semibold text-green-700">Likes</span>
                      </div>
                      <ul className="space-y-1">
                        {report.likes.map((like, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{like}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {Array.isArray(report.dislikes) && report.dislikes.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
                        </svg>
                        <span className="text-sm font-semibold text-red-700">Dislikes</span>
                      </div>
                      <ul className="space-y-1">
                        {report.dislikes.map((dislike, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{dislike}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Top Performing Posts */}
            {(Array.isArray(report.detailedPostMetrics?.topPerformingPosts) && report.detailedPostMetrics.topPerformingPosts.length > 0) && (
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <h3 className="font-semibold text-gray-900">Top Performing Posts</h3>
                </div>
                <div className="space-y-3">
                  {report.detailedPostMetrics.topPerformingPosts.map((post, index) => (
                    <div key={index} className="border border-gray-200 rounded p-3 bg-gray-50">
                      <div className="text-sm text-gray-700 mb-2">{post.shortText || post.content || '—'}</div>
                      <div className="flex flex-wrap gap-2 text-xs">
                        {post.type && (
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {post.type}
                          </span>
                        )}
                        {post.sentiment && (
                          <span className={`px-2 py-1 rounded ${
                            post.sentiment === 'Positive' ? 'bg-green-100 text-green-700' :
                            post.sentiment === 'Negative' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {post.sentiment}
                          </span>
                        )}
                        {post.engagement && (
                          <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">
                            Engagement: {post.engagement}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Confidence Explanation */}
            {report.confidenceExplanation && (
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="font-semibold text-gray-900">Confidence Explanation</h3>
                </div>
                {report.confidenceExplanation.overallScore && (
                  <div className="mb-3 p-3 bg-teal-50 rounded text-center">
                    <div className="text-2xl font-bold text-teal-600">
                      {report.confidenceExplanation.overallScore}
                    </div>
                    <div className="text-xs text-gray-600">Overall Confidence Score</div>
                  </div>
                )}
                {Array.isArray(report.confidenceExplanation.parameters) && report.confidenceExplanation.parameters.length > 0 && (
                  <div className="overflow-x-auto mb-3">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                          <th className="px-3 py-2 bg-gray-100">Parameter</th>
                          <th className="px-3 py-2 bg-gray-100">Score</th>
                          <th className="px-3 py-2 bg-gray-100">Reasoning</th>
                        </tr>
                      </thead>
                      <tbody>
                        {report.confidenceExplanation.parameters.map((p, i) => (
                          <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                            <td className="px-3 py-3 font-medium text-gray-900">{p.parameter || '—'}</td>
                            <td className="px-3 py-3">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                parseInt(p.score) >= 8 ? 'bg-green-100 text-green-700' :
                                parseInt(p.score) >= 5 ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {p.score || '—'}
                              </span>
                            </td>
                            <td className="px-3 py-3 text-gray-700">{p.reasoning || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {report.confidenceExplanation.interpretation && (
                  <div className="text-sm text-gray-700 italic">
                    {report.confidenceExplanation.interpretation}
                  </div>
                )}
              </div>
            )}

            {/* Company Overview */}
            {report.companyOverview && (
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <h3 className="font-semibold text-gray-900">Company Overview</h3>
                </div>
                <div className="text-sm text-gray-700 space-y-2">
                  {report.companyOverview.companyName && (
                    <div className="font-semibold text-lg text-gray-900">{report.companyOverview.companyName}</div>
                  )}
                  {Array.isArray(report.companyOverview.specializations) && report.companyOverview.specializations.length > 0 && (
                    <div>
                      <div className="font-semibold mb-1">Specializations:</div>
                      <ul className="ml-4 space-y-1">
                        {report.companyOverview.specializations.map((s, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 flex-shrink-0" />
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {Array.isArray(report.companyOverview.keyFeatures) && report.companyOverview.keyFeatures.length > 0 && (
                    <div>
                      <div className="font-semibold mb-1">Key Features:</div>
                      <ul className="ml-4 space-y-1">
                        {report.companyOverview.keyFeatures.map((f, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 flex-shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {report.companyOverview.pricingModel && (
                    <div>
                      <span className="font-semibold">Pricing Model:</span> {report.companyOverview.pricingModel}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Data Sources */}
            {Array.isArray(report.dataSources) && report.dataSources.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                  </svg>
                  <h3 className="font-semibold text-gray-900">Data Sources</h3>
                </div>
                <ul className="space-y-1">
                  {report.dataSources.map((source, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{source}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommended Approach */}
            {report.recommendedApproach && (
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  <h3 className="font-semibold text-gray-900">Recommended Approach</h3>
                </div>
                <div className="text-sm text-gray-700 whitespace-pre-line">{report.recommendedApproach}</div>
              </div>
            )}

            {/* Next Steps */}
            {Array.isArray(report.nextSteps) && report.nextSteps.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h3 className="font-semibold text-gray-900">Next Steps</h3>
                </div>
                <ol className="space-y-2">
                  {report.nextSteps.map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">{i + 1}</div>
                      <span className="text-sm text-gray-700">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        )}
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {() => (
        <div className="space-y-6 max-w-6xl mx-auto">
          <header>
            <h1 className="text-2xl font-bold mb-2">History</h1>
            <p className="text-slate-600">Review past DISC analysis reports from your Sellinder account.</p>
          </header>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
          ) : analyses.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
              <p className="text-slate-600">No analysis history found.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analyses.map((analysis, index) => {
                  const displayName = extractNameFromAnalysis(analysis) || 
                    analysis.profile?.name ||
                    analysis.analysis?.profile?.name ||
                    analysis.profileName ||
                    analysis.name ||
                    'Unknown Profile';
                  
                  const disc = analysis.personality?.disc || analysis.analysis?.personality?.disc || analysis.analysis?.analysis?.personality?.disc || {};
                  const d = disc.dominance ?? disc.D ?? disc.d ?? 0;
                  const i = disc.influence ?? disc.I ?? disc.i ?? 0;
                  const s = disc.steadiness ?? disc.S ?? disc.s ?? 0;
                  const c = disc.conscientiousness ?? disc.C ?? disc.c ?? 0;
                  
                  return (
                  <div
                    key={analysis._id || index}
                    onClick={() => setSelectedAnalysis(analysis)}
                    className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    style={{
                      backgroundColor: index % 3 === 0 ? '#EFF6FF' : index % 3 === 1 ? '#F0FDF4' : '#FEF9E7'
                    }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {displayName}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(
                            analysis.createdAt || 
                            analysis.date || 
                            analysis.timestamp || 
                            analysis.analysisDate ||
                            analysis.analysis?.createdAt ||
                            analysis.analysis?.date ||
                            analysis.analysis?.timestamp
                          )}
                        </p>
                      </div>
                      {analysis.pdfUrl && (
                        <span className="text-xs text-red-600 flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0017.414 6L14 2.586A2 2 0 0012.586 2H8z" />
                          </svg>
                          PDF
                        </span>
                      )}
                    </div>

                    <div className="mb-3">
                      <p className="text-sm text-gray-600">
                        DISC: D: {d}— I: {i}— S: {s}— C: {c}—
                      </p>
                      <p className="text-sm text-gray-600">
                        Posts analyzed: {extractPostsAnalyzed(analysis)}
                      </p>
                    </div>
                  </div>
                  );
                })}
              </div>

              {/* Pagination */}
              <div className="flex justify-end items-center gap-3 mt-8 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <span className="text-sm font-medium text-gray-700 mr-2">
                  ({totalCount} total)
                </span>
                
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  ← Previous
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Page</span>
                  <input
                    type="number"
                    min="1"
                    max={totalPages}
                    placeholder={currentPage}
                    onKeyDown={handlePageInput}
                    className="w-16 h-10 text-center rounded-md border-2 border-gray-300 font-semibold text-gray-800 focus:outline-none focus:border-orange-400"
                  />
                  <span className="text-sm text-gray-600">of {totalPages}</span>
                </div>

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next →
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default HistoryDashboardPage;
