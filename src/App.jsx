
import React, {
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';

import {
  ArrowDownToLine,
  ArrowUpRight,
  Check,
  Copy,
  Download,
  Globe,
  ImagePlus,
  Plus,
  Save,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Trash2,
  X
} from 'lucide-react';

import { garments, fabrics, colors } from './data';
import GarmentPreview from './components/GarmentPreview';

const initial = {
  garment: 'tee',
  color: '#f2eee5',
  fabric: 'cotton',
  size: 'M',
  designName: 'My new design',
  notes: '',
  artwork: null
};

const copy = {
  en: {
    studio: 'Design studio',
    subtitle: 'Create your next signature piece.',
    library: 'My designs',
    shop: 'Collection',
    language: 'العربية',
    save: 'Save design',
    new: 'New design',
    garment: 'Garment',
    fabric: 'Fabric',
    color: 'Color palette',
    size: 'Size',
    details: 'Design details',
    name: 'Design name',
    notes: 'Notes',
    upload: 'Upload artwork',
    saved: 'Saved designs',
    empty: 'Your saved designs will appear here.',
    add: 'Add to bag',
    bag: 'Shopping bag',
    clear: 'Clear',
    total: 'Estimated total',
    preview: '3D preview',
    remove: 'Remove',
    savedMsg: 'Design saved successfully',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    home: 'Studio',
    shopTitle: 'Explore the collection',
    bagEmpty: 'Your bag is empty.',
    search: 'Search your designs...',
    duplicate: 'Duplicate',
    export: 'Export',
    reset: 'Start a new design',
    fabricInfo: 'Fabric information',
    deleteConfirm: 'Delete this design?',
    added: 'Added to bag',
    copied: 'Design duplicated',
    exported: 'Design exported',
    artworkRemoved: 'Artwork removed',
    invalidImage: 'Use PNG, JPG, WEBP or SVG',
    largeImage: 'Maximum file size is 5 MB',
    checkout: 'Continue to checkout',
    checkoutDemo: 'Demo only — payment is not connected',
    demoNotice: 'Demo checkout: connect a payment provider and configure shipping before accepting real orders.',
    designCount: 'designs',
    itemCount: 'items',
    noResults: 'No designs found.',
    savedAt: 'Created',
    removeArtwork: 'Remove artwork'
  },

  ar: {
    studio: 'استوديو التصميم',
    subtitle: 'صمّم قطعتك المميزة القادمة.',
    library: 'تصميماتي',
    shop: 'المجموعة',
    language: 'English',
    save: 'حفظ التصميم',
    new: 'تصميم جديد',
    garment: 'نوع القطعة',
    fabric: 'القماش',
    color: 'الألوان',
    size: 'المقاس',
    details: 'تفاصيل التصميم',
    name: 'اسم التصميم',
    notes: 'ملاحظات',
    upload: 'إضافة شعار أو صورة',
    saved: 'التصميمات المحفوظة',
    empty: 'ستظهر تصميماتك المحفوظة هنا.',
    add: 'أضف إلى السلة',
    bag: 'سلة التسوق',
    clear: 'مسح',
    total: 'الإجمالي التقديري',
    preview: 'معاينة ثلاثية الأبعاد',
    remove: 'حذف',
    savedMsg: 'تم حفظ التصميم بنجاح',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    home: 'الاستوديو',
    shopTitle: 'استكشف المجموعة',
    bagEmpty: 'سلتك فارغة.',
    search: 'ابحث عن تصميماتك...',
    duplicate: 'نسخ التصميم',
    export: 'تصدير',
    reset: 'ابدأ تصميماً جديداً',
    fabricInfo: 'معلومات القماش',
    deleteConfirm: 'حذف هذا التصميم؟',
    added: 'تمت الإضافة إلى السلة',
    copied: 'تم نسخ التصميم',
    exported: 'تم تصدير التصميم',
    artworkRemoved: 'تم حذف الصورة',
    invalidImage: 'استخدم PNG أو JPG أو WEBP أو SVG',
    largeImage: 'الحجم الأقصى للصورة 5 ميجابايت',
    checkout: 'متابعة الدفع',
    checkoutDemo: 'هذه نسخة تجريبية — الدفع غير متصل',
    demoNotice: 'الدفع تجريبي: يجب ربط بوابة دفع وإعداد الشحن قبل استقبال الطلبات الحقيقية.',
    designCount: 'تصميمات',
    itemCount: 'منتجات',
    noResults: 'لم يتم العثور على تصميمات.',
    savedAt: 'تاريخ الإنشاء',
    removeArtwork: 'حذف الصورة'
  }
};

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function downloadJSON(data, filename) {
  const blob = new Blob(
    [JSON.stringify(data, null, 2)],
    { type: 'application/json' }
  );

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function App() {
  const [lang, setLang] = useState('en');
  const [tab, setTab] = useState('studio');

  const [design, setDesign] = useState(initial);

  const [saved, setSaved] = useState(() =>
    readStorage('azhy-designs', [])
  );

  const [bag, setBag] = useState(() =>
    readStorage('azhy-bag', [])
  );

  const [toast, setToast] = useState('');
  const [search, setSearch] = useState('');

  const fileRef = useRef(null);
  const toastTimer = useRef(null);

  const t = copy[lang];
  const rtl = lang === 'ar';

  useEffect(() => {
    try {
      localStorage.setItem('azhy-designs', JSON.stringify(saved));
    } catch {
      notify(rtl
        ? 'تعذر حفظ التصميمات في الجهاز'
        : 'Could not save designs on this device'
      );
    }
  }, [saved]);

  useEffect(() => {
    try {
      localStorage.setItem('azhy-bag', JSON.stringify(bag));
    } catch {
      notify(rtl
        ? 'تعذر حفظ السلة'
        : 'Could not save shopping bag'
      );
    }
  }, [bag]);

  useEffect(() => {
    return () => {
      if (toastTimer.current) {
        clearTimeout(toastTimer.current);
      }
    };
  }, []);

  const garment = garments.find(
    item => item.id === design.garment
  ) || garments[0];

  const selectedFabric = fabrics.find(
    item => item.id === design.fabric
  ) || fabrics[0];

  const total = useMemo(
    () => bag.reduce((sum, item) => sum + Number(item.price || 0), 0),
    [bag]
  );

  const filteredSaved = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return saved;

    return saved.filter(item =>
      [
        item.designName,
        item.garmentName,
        item.fabric,
        item.size
      ].some(value =>
        String(value || '').toLowerCase().includes(term)
      )
    );
  }, [saved, search]);

  function notify(message) {
    setToast(message);

    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }

    toastTimer.current = setTimeout(() => {
      setToast('');
    }, 2600);
  }

  function update(key, value) {
    setDesign(current => ({
      ...current,
      [key]: value
    }));
  }

  function createDesign() {
    setDesign({
      ...initial,
      designName: rtl ? 'تصميم جديد' : 'My new design'
    });

    setTab('studio');
    notify(rtl ? 'تم فتح تصميم جديد' : 'New design started');
  }

  function save() {
    const item = {
      ...design,
      id: Date.now(),
      garmentName: garment.name,
      fabricName: selectedFabric.name,
      price: garment.price,
      created: new Date().toISOString()
    };

    setSaved(current => [item, ...current]);
    notify(t.savedMsg);
  }

  function load(item) {
    setDesign({
      ...initial,
      ...item
    });

    setTab('studio');
    notify(rtl ? 'تم فتح التصميم' : 'Design opened');
  }

  function duplicate(item) {
    const newItem = {
      ...item,
      id: Date.now(),
      designName: `${item.designName || 'Design'} Copy`,
      created: new Date().toISOString()
    };

    setSaved(current => [newItem, ...current]);
    notify(t.copied);
  }

  function deleteDesign(id) {
    setSaved(current =>
      current.filter(item => item.id !== id)
    );

    notify(rtl ? 'تم حذف التصميم' : 'Design deleted');
  }

  function addToBag(item = design) {
    const selectedGarment = garments.find(
      g => g.id === item.garment
    ) || garments[0];

    const bagItem = {
      ...item,
      id: Date.now() + Math.random(),
      title: item.designName || selectedGarment.name,
      garmentName: selectedGarment.name,
      price: selectedGarment.price
    };

    setBag(current => [...current, bagItem]);
    notify(t.added);
  }

  function upload(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      'image/png',
      'image/jpeg',
      'image/webp',
      'image/svg+xml'
    ];

    if (!allowedTypes.includes(file.type)) {
      notify(t.invalidImage);
      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      notify(t.largeImage);
      e.target.value = '';
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      update('artwork', reader.result);
      notify(rtl ? 'تمت إضافة الصورة' : 'Artwork uploaded');
    };

    reader.onerror = () => {
      notify(rtl ? 'تعذر قراءة الصورة' : 'Could not read image');
    };

    reader.readAsDataURL(file);
    e.target.value = '';
  }

  function exportDesign(item = design) {
    const filename = `${(item.designName || 'azhy-design')
      .replace(/[^a-z0-9-_]/gi, '-')
      .toLowerCase()}.json`;

    downloadJSON(item, filename);
    notify(t.exported);
  }

  function exportAll() {
    downloadJSON(saved, 'azhy-all-designs.json');
    notify(t.exported);
  }

  function removeFromBag(id) {
    setBag(current =>
      current.filter(item => item.id !== id)
    );
  }

  function clearBag() {
    setBag([]);
    notify(rtl ? 'تم إفراغ السلة' : 'Shopping bag cleared');
  }

  return (
    <div
      className={rtl ? 'app rtl' : 'app'}
      dir={rtl ? 'rtl' : 'ltr'}
    >
      <header className="topbar">
        <a
          className="brand"
          href="#"
          onClick={e => {
            e.preventDefault();
            setTab('studio');
          }}
        >
          <span className="brand-mark">A</span>

          <span>
            AZHY
            <small>FASHION STUDIO</small>
          </span>
        </a>

        <nav>
          <button
            className={tab === 'studio' ? 'active' : ''}
            onClick={() => setTab('studio')}
          >
            {t.home}
          </button>

          <button
            className={tab === 'collection' ? 'active' : ''}
            onClick={() => setTab('collection')}
          >
            {t.shop}
          </button>

          <button
            className={tab === 'saved' ? 'active' : ''}
            onClick={() => setTab('saved')}
          >
            {t.library}
          </button>
        </nav>

        <div className="top-actions">
          <button
            className="icon-btn"
            onClick={() => setLang(current =>
              current === 'en' ? 'ar' : 'en'
            )}
          >
            <Globe size={17} />
            {t.language}
          </button>

          <button
            className="bag-btn"
            onClick={() => setTab('bag')}
          >
            <ShoppingBag size={17} />
            <span>{bag.length}</span>
          </button>
        </div>
      </header>

      <main>
        {tab === 'studio' && (
          <>
            <section className="hero">
              <div>
                <div className="eyebrow">
                  THE CREATIVE ATELIER · 2026
                </div>

                <h1>
                  {t.studio}
                  <br />
                  <em>AZHY.</em>
                </h1>

                <p>{t.subtitle}</p>
              </div>

              <div className="hero-side">
                DESIGN
                <br />
                YOUR
                <br />
                <span>IDENTITY</span>
              </div>
            </section>

            <div className="studio-grid">
              <section className="preview-panel">
                <div className="panel-heading">
                  <div>
                    <span className="eyebrow">
                      01 / VISUALIZE
                    </span>

                    <h2>{t.preview}</h2>
                  </div>

                  <button
                    className="outline-btn"
                    onClick={createDesign}
                  >
                    <Plus size={15} />
                    {t.new}
                  </button>
                </div>

                <GarmentPreview
                  type={design.garment}
                  color={design.color}
                />

                <div className="preview-caption">
                  <span>
                    {rtl ? garment.ar : garment.name}
                  </span>

                  <span>{design.color.toUpperCase()}</span>
                </div>

                <div className="fabric-description">
                  <strong>{t.fabricInfo}</strong>
                  <p>
                    {rtl
                      ? selectedFabric.arDesc
                      : selectedFabric.desc}
                  </p>
                </div>

                {design.artwork && (
                  <div className="art-preview">
                    <img
                      src={design.artwork}
                      alt="Uploaded artwork"
                    />

                    <button
                      onClick={() => {
                        update('artwork', null);
                        notify(t.artworkRemoved);
                      }}
                      aria-label={t.removeArtwork}
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </section>

              <section className="controls">
                <div className="panel-heading">
                  <div>
                    <span className="eyebrow">
                      02 / CUSTOMIZE
                    </span>

                    <h2>{t.details}</h2>
                  </div>

                  <SlidersHorizontal size={19} />
                </div>

                <label className="field-label">
                  {t.garment}
                </label>

                <div className="garment-grid">
                  {garments.map(item => (
                    <button
                      key={item.id}
                      className={
                        design.garment === item.id
                          ? 'garment-card selected'
                          : 'garment-card'
                      }
                      onClick={() => update('garment', item.id)}
                    >
                      <span className="garment-icon">
                        {item.id === 'hoodie'
                          ? '◒'
                          : item.id === 'pants'
                            ? '▥'
                            : item.id === 'jacket'
                              ? '◇'
                              : '▱'}
                      </span>

                      <span>
                        {rtl ? item.ar : item.name}
                      </span>

                      <small>${item.price}</small>
                    </button>
                  ))}
                </div>

                <div className="two-col">
                  <div>
                    <label className="field-label">
                      {t.fabric}
                    </label>

                    <select
                      value={design.fabric}
                      onChange={e =>
                        update('fabric', e.target.value)
                      }
                    >
                      {fabrics.map(item => (
                        <option
                          key={item.id}
                          value={item.id}
                        >
                          {rtl ? item.ar : item.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="field-label">
                      {t.size}
                    </label>

                    <select
                      value={design.size}
                      onChange={e =>
                        update('size', e.target.value)
                      }
                    >
                      {t.sizes.map(size => (
                        <option key={size}>{size}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <label className="field-label">
                  {t.color}
                </label>

                <div className="swatches">
                  {colors.map(color => (
                    <button
                      key={color}
                      aria-label={color}
                      className={
                        design.color === color
                          ? 'swatch chosen'
                          : 'swatch'
                      }
                      style={{ background: color }}
                      onClick={() => update('color', color)}
                    >
                      {design.color === color && (
                        <Check
                          size={15}
                          color={
                            color === '#f2eee5' ||
                            color === '#ffffff'
                              ? '#111'
                              : 'white'
                          }
                        />
                      )}
                    </button>
                  ))}

                  <input
                    aria-label="Custom color"
                    type="color"
                    value={design.color}
                    onChange={e =>
                      update('color', e.target.value)
                    }
                  />
                </div>

                <label className="field-label">
                  {t.name}
                </label>

                <input
                  value={design.designName}
                  onChange={e =>
                    update('designName', e.target.value)
                  }
                  placeholder={t.name}
                  maxLength={60}
                />

                <label className="field-label">
                  {t.notes}
                </label>

                <textarea
                  rows="2"
                  value={design.notes}
                  onChange={e =>
                    update('notes', e.target.value)
                  }
                  placeholder={t.notes}
                  maxLength={500}
                />

                <input
                  ref={fileRef}
                  hidden
                  type="file"
                  accept=".png,.jpg,.jpeg,.webp,.svg,image/png,image/jpeg,image/webp,image/svg+xml"
                  onChange={upload}
                />

                <button
                  className="upload-btn"
                  onClick={() => fileRef.current?.click()}
                >
                  <ImagePlus size={17} />
                  {t.upload}
                  <span>PNG / JPG / SVG · 5MB</span>
                </button>

                <div className="action-row">
                  <button
                    className="primary-btn"
                    onClick={save}
                  >
                    <Save size={16} />
                    {t.save}
                  </button>

                  <button
                    className="secondary-btn"
                    onClick={() => exportDesign()}
                    aria-label={t.export}
                    title={t.export}
                  >
                    <ArrowDownToLine size={16} />
                  </button>

                  <button
                    className="secondary-btn"
                    onClick={() => addToBag()}
                    aria-label={t.add}
                    title={t.add}
                  >
                    <ShoppingBag size={16} />
                  </button>
                </div>

                <button
                  className="text-btn"
                  onClick={createDesign}
                >
                  <Plus size={15} />
                  {t.reset}
                </button>
              </section>
            </div>
          </>
        )}

        {tab === 'saved' && (
          <section className="page-section">
            <div className="page-title">
              <div className="eyebrow">
                YOUR CREATIVE ARCHIVE
              </div>

              <h1>{t.saved}</h1>

              <p>
                {saved.length} {t.designCount}
              </p>
            </div>

            <div className="saved-toolbar">
              <div className="search-box">
                <Search size={17} />

                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder={t.search}
                />
              </div>

              {saved.length > 0 && (
                <button
                  className="outline-btn"
                  onClick={exportAll}
                >
                  <Download size={15} />
                  {t.export}
                </button>
              )}
            </div>

            {saved.length === 0 ? (
              <p className="empty">{t.empty}</p>
            ) : filteredSaved.length === 0 ? (
              <p className="empty">{t.noResults}</p>
            ) : (
              <div className="saved-grid">
                {filteredSaved.map(item => (
                  <article
                    className="saved-card"
                    key={item.id}
                  >
                    <div
                      className="saved-color"
                      style={{ background: item.color }}
                    >
                      <span>AZHY</span>
                    </div>

                    <div className="saved-info">
                      <b>{item.designName}</b>

                      <small>
                        {item.garmentName} · {item.size} · {item.color}
                      </small>

                      <div>
                        <button onClick={() => load(item)}>
                          {rtl ? 'فتح' : 'Open'}
                        </button>

                        <button
                          onClick={() => duplicate(item)}
                          title={t.duplicate}
                          aria-label={t.duplicate}
                        >
                          <Copy size={14} />
                        </button>

                        <button
                          onClick={() => exportDesign(item)}
                          title={t.export}
                          aria-label={t.export}
                        >
                          <Download size={14} />
                        </button>

                        <button
                          onClick={() => addToBag(item)}
                          title={t.add}
                          aria-label={t.add}
                        >
                          <ShoppingBag size={14} />
                        </button>

                        <button
                          onClick={() => deleteDesign(item.id)}
                          title={t.remove}
                          aria-label={t.remove}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {tab === 'collection' && (
          <section className="page-section">
            <div className="page-title">
              <div className="eyebrow">
                CURATED ESSENTIALS
              </div>

              <h1>{t.shopTitle}</h1>
            </div>

            <div className="product-grid">
              {garments.map(item => (
                <article
                  className="product-card"
                  key={item.id}
                >
                  <div className="product-visual">
                    <span>AZHY</span>
                    <b>{item.type.toUpperCase()}</b>
                  </div>

                  <div className="product-meta">
                    <div>
                      <b>
                        {rtl ? item.ar : item.name}
                      </b>

                      <small>Made for your identity</small>
                    </div>

                    <strong>${item.price}</strong>
                  </div>

                  <button
                    className="primary-btn full"
                    onClick={() => {
                      update('garment', item.id);
                      setTab('studio');
                    }}
                  >
                    Customize
                    <ArrowUpRight size={15} />
                  </button>
                </article>
              ))}
            </div>
          </section>
        )}

        {tab === 'bag' && (
          <section className="page-section">
            <div className="page-title">
              <div className="eyebrow">
                YOUR SELECTION
              </div>

              <h1>{t.bag}</h1>

              <p>
                {bag.length} {t.itemCount}
              </p>
            </div>

            {bag.length === 0 ? (
              <p className="empty">{t.bagEmpty}</p>
            ) : (
              <>
                <div className="bag-list">
                  {bag.map(item => (
                    <div
                      className="bag-item"
                      key={item.id}
                    >
                      <span
                        className="bag-swatch"
                        style={{ background: item.color }}
                      />

                      <div>
                        <b>{item.title}</b>

                        <small>
                          {item.garmentName} · {item.size}
                        </small>
                      </div>

                      <strong>${item.price}</strong>

                      <button
                        onClick={() => removeFromBag(item.id)}
                        aria-label={t.remove}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="bag-total">
                  <span>{t.total}</span>
                  <strong>${total.toFixed(2)}</strong>
                </div>

                <p className="notice">
                  {t.demoNotice}
                </p>

                <button
                  className="primary-btn"
                  onClick={() => notify(t.checkoutDemo)}
                >
                  {t.checkout}
                </button>

                <button
                  className="text-btn"
                  onClick={clearBag}
                >
                  {t.clear}
                </button>
              </>
            )}
          </section>
        )}
      </main>

      <footer>
        <span>AZHY FASHION STUDIO</span>
        <span>CREATE WITH PURPOSE · WEAR YOUR STORY</span>
      </footer>

      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </div>
  );
}
