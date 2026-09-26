/**
 * MARRYWITHDIGNITY - SUPABASE CLIENT & LIVE ENGINE
 * Project URL: https://arxtahxfxkbgghfnnltu.supabase.co
 * Dynamic live metrics, storage bucket ('receipts') uploads, donations table integration, and receipt upload sync.
 */

(function(window, document) {
  'use strict';

  const SUPABASE_CONFIG = {
    url: 'https://arxtahxfxkbgghfnnltu.supabase.co',
    anonKey: 'sb_publishable_udJI4SZe-V3p2q8GtRog0g_B9vLpDHf'
  };

  let supabaseClient = null;

  function initSupabase() {
    if (window.supabase && typeof window.supabase.createClient === 'function') {
      try {
        supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
        window.mwdSupabase = supabaseClient;
      } catch (err) {
        console.warn('Supabase initialization error:', err);
      }
    } else {
      // Lazy retry in case CDN loads asynchronously
      setTimeout(() => {
        if (window.supabase && typeof window.supabase.createClient === 'function') {
          try {
            supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
            window.mwdSupabase = supabaseClient;
            fetchLiveMetrics();
          } catch (e) {
            console.warn('Supabase retry initialization failed:', e);
          }
        }
      }, 500);
    }
  }

  /**
   * Fetch live metrics from Supabase `site_metrics` table
   */
  async function fetchLiveMetrics() {
    if (!supabaseClient) {
      // Fallback direct REST fetch if SDK not ready
      try {
        const response = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/site_metrics?select=*&limit=1`, {
          headers: {
            'apikey': SUPABASE_CONFIG.anonKey,
            'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            applyLiveMetrics(data[0]);
          }
        }
      } catch (err) {
        console.warn('Direct REST live metrics fetch skipped:', err);
      }
      return;
    }

    try {
      const { data, error } = await supabaseClient
        .from('site_metrics')
        .select('*')
        .limit(1);

      if (!error && Array.isArray(data) && data.length > 0) {
        applyLiveMetrics(data[0]);
      }
    } catch (err) {
      console.warn('Supabase live metrics query skipped:', err);
    }
  }

  /**
   * Apply live metrics data to UI counters
   */
  function applyLiveMetrics(metricRow) {
    if (!metricRow) return;

    // 1. Brides Sponsored Counter
    const bridesCount = metricRow.brides_sponsored || metricRow.bridesCount || 120;
    const brideCounterEls = document.querySelectorAll('#bridesSponsoredCounter, [data-metric="brides_sponsored"], .hero-stat-card:first-child .hero-stat-val');
    
    brideCounterEls.forEach(el => {
      if (el) {
        animateCounter(el, parseInt(bridesCount, 10));
      }
    });

    // 2. Itemized Invoices Percentage
    if (metricRow.itemized_invoices_pct !== undefined) {
      const invoicesEls = document.querySelectorAll('[data-metric="invoices_pct"]');
      invoicesEls.forEach(el => {
        if (el) el.textContent = `${metricRow.itemized_invoices_pct}%`;
      });
    }
  }

  /**
   * Smooth number animation for live counter
   */
  function animateCounter(el, targetNum) {
    if (!el) return;
    const startNum = 0;
    const duration = 1200;
    const startTime = performance.now();

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(startNum + (targetNum - startNum) * easeProgress);
      
      el.textContent = `${current}+`;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = `${targetNum}+`;
      }
    }

    requestAnimationFrame(update);
  }

  /**
   * Upload Receipt Screenshot / File to Supabase Storage Bucket ('receipts')
   */
  async function uploadReceiptFile(file, trackingId) {
    if (!file) return null;

    const fileExt = file.name ? file.name.split('.').pop() : 'png';
    const cleanTrackingId = (trackingId || 'REC').replace(/[^a-zA-Z0-9_-]/g, '_');
    const fileName = `${cleanTrackingId}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    // 1. Try Supabase SDK Storage Upload
    if (supabaseClient && supabaseClient.storage) {
      try {
        const { data, error } = await supabaseClient.storage
          .from('receipts')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true
          });

        if (!error && data) {
          const { data: publicUrlData } = supabaseClient.storage
            .from('receipts')
            .getPublicUrl(filePath);

          return publicUrlData && publicUrlData.publicUrl ? publicUrlData.publicUrl : `${SUPABASE_CONFIG.url}/storage/v1/object/public/receipts/${filePath}`;
        } else {
          console.warn('Supabase storage SDK notice:', error);
        }
      } catch (err) {
        console.warn('Supabase storage SDK exception:', err);
      }
    }

    // 2. Direct REST Upload Fallback
    try {
      const res = await fetch(`${SUPABASE_CONFIG.url}/storage/v1/object/receipts/${filePath}`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_CONFIG.anonKey,
          'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`,
          'Content-Type': file.type || 'image/jpeg'
        },
        body: file
      });
      if (res.ok) {
        return `${SUPABASE_CONFIG.url}/storage/v1/object/public/receipts/${filePath}`;
      }
    } catch (e) {
      console.warn('Storage REST fallback notice:', e);
    }

    return null;
  }

  /**
   * Insert donation or receipt submission to Supabase `donations` table
   */
  async function submitDonationToSupabase(payload, file) {
    const trackingId = payload.trackingId || ('MWD-REC-' + Math.floor(100000 + Math.random() * 900000));
    
    let uploadedReceiptUrl = payload.receiptUrl || null;
    if (file && !uploadedReceiptUrl) {
      try {
        uploadedReceiptUrl = await uploadReceiptFile(file, trackingId);
      } catch (uploadErr) {
        console.warn('Receipt upload exception:', uploadErr);
      }
    }

    const donationRecord = {
      donor_name: payload.donorName || payload.donor_name || 'Anonymous Donor',
      donor_phone: payload.phone || payload.donor_phone || null,
      donor_email: payload.email || payload.donor_email || null,
      amount: parseFloat(payload.amount) || 0,
      currency: payload.currency || 'PKR',
      payment_method: payload.paymentMethod || payload.payment_method || 'Online / Bank',
      transaction_id: payload.transactionId || payload.transaction_id || trackingId,
      donation_type: payload.donationType || payload.cause || payload.category || 'General',
      receipt_url: uploadedReceiptUrl,
      status: 'pending'
    };

    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from('donations')
          .insert([donationRecord]);

        if (error) {
          console.warn('Supabase SDK insert error:', error);
          return await fallbackRestInsert(donationRecord);
        }
        return { success: true, data, receiptUrl: uploadedReceiptUrl };
      } catch (err) {
        console.warn('Supabase SDK insert exception:', err);
        return await fallbackRestInsert(donationRecord);
      }
    } else {
      return await fallbackRestInsert(donationRecord);
    }
  }

  async function fallbackRestInsert(record) {
    try {
      const response = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/donations`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_CONFIG.anonKey,
          'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(record)
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        return { success: false, error: errJson.message || 'REST Insert Error', receiptUrl: record.receipt_url };
      }

      const data = await response.json().catch(() => ({}));
      return { success: true, data, receiptUrl: record.receipt_url };
    } catch (err) {
      console.warn('REST insert exception:', err);
      return { success: false, error: err.message, receiptUrl: record.receipt_url };
    }
  }

  // Export functions to global window namespace
  window.MWD_SUPABASE = {
    config: SUPABASE_CONFIG,
    getClient: () => supabaseClient,
    fetchLiveMetrics,
    uploadReceiptFile,
    submitDonationToSupabase
  };

  // Auto-init on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', () => {
    initSupabase();
    fetchLiveMetrics();
  });

})(window, document);
