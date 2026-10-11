function formatDate$1(K) {
	const X = new Date(K), // تحويل المدخل إلى كائن تاريخ Date
		Z = X.getFullYear(), // استخراج السنة
		ee = String(X.getMonth() + 1).padStart(2, "0"), // استخراج الشهر
		te = String(X.getDate()).padStart(2, "0"); // استخراج اليوم
	return `${Z}-${ee}-${te}` // إرجاع التاريخ بالتنسيق النهائي (YYYY-MM-DD)
}

// ==========================================
// 2. إعدادات المفاتيح المتغيرات البيئية (Vite)
// ==========================================
const __vite_import_meta_env__$x = {
		VITE_APP_API_URL_INQUIRIES: "https://api.lean.sa/seha/inquiries",
		VITE_APP_RECAPETCHAKEY: "6LdApK4ZAAAAADhvh3s9bNw7cfsb7hLEjVVeKZii" // مفتاح التحقق من روبوتات جوجل reCAPTCHA
	},
	env$v = __vite_import_meta_env__$x,

	// ==========================================
	// 3. المكون الرئيسي للاستعلام عن الإجازة (React Component)
	// ==========================================
	Slenquiry$1 = () => {
		// --- تعاريف حالات المكون (States) ---
		const [K, X] = reactExports.useState(""), // [K]: قيمة رمز الخدمة / رقم الإجازة المُدخلة
			[Z, ee] = reactExports.useState(""), // [Z]: قيمة رقم الهوية/الإقامة المُدخلة
			[te, se] = reactExports.useState([]), // [te]: مصفوفة رسائل التنبيه بالأخطاء
			[ne, re] = reactExports.useState(!1), // [ne]: حالة وجود خطأ في الاتصال بالأبي آي
			[ae, ie] = reactExports.useState(!1), // [ae]: حالة التحميل (إظهار رمز الانتظار)
			[oe, ce] = reactExports.useState(), // [oe]: كائن يحتوي على نتائج الاستعلام المرجعة
			[le, ue] = reactExports.useState(!0), // [le]: التحكم بظهور زر (استعلام) أو (استعلام جديد)

			// --- دوال تحديث المدخلات ---
			Ae = me => { X(me.target.value) }, // تحديث رقم الإجازة عند الكتابة
			de = me => { ee(me.target.value) }, // تحديث رقم الهوية عند الكتابة

			// جلب مفتاح API من التخزين المحلي أو من الملف البيئي
			ge = localStorage.getItem("ApiKeyInquiries") || env$v.VITE_APP_API_KEY_INQUIRIES,

			// --- دالة تنفيذ الاستعلام عند الضغط على الزر ---
			pe = me => {
				me.stopPropagation();
				ce(""); // تفريغ النتائج السابقة
				re(!1); // إلغاء إشارة الخطأ

				// [التحقق من المدخلات]
				K == "" || K.trim() == "" 
					? se(["فضلا اكتب الرمز "]) // تنبيه إذا كان الرمز فارغاً
					: validateID(Z) < 0 
					? se(["رقم الهوية خاطئ "]) // تنبيه إذا كانت الهوية غير صحيحة
					: (
						ie(!0), // تفعيل حالة التحميل

						// [تنفيذ اختبار reCAPTCHA للتحقق من عدم وجود بوت]
						window.grecaptcha.ready(function() {
							window.grecaptcha.execute(env$v.VITE_APP_RECAPETCHAKEY, { action: "submit" })
							.then(function(Ee) { // Ee هو الـ Token الناتج عن reCAPTCHA
								
								// إعداد الترويسات (Headers) للطلب
								let fe = new Headers;
								fe.append("apikey", ge), 
								fe.append("x-token", Ee), 
								fe.append("content-type", "application/json");

								// [إرسال الطلب لقاعدة البيانات Supabase بالأسماء الجديدة من الملف]
								fetch(`https://kexrdqxofvndwgsamvuq.supabase.co/rest/v1/sick_leaves?employee_id=eq.${Z}&رقم الاجازه=eq.${K}`, {
									headers: {
										apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
										Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
									}
								})
								.then(ve => ve.json())
								.then(ve => {
									let res = { data: ve };

									// في حال وجود بيانات وتاريخ زيارة/إصدار، يتم تحويل صيغته
									if (res.data.length > 0 && res.data[0].visit_date != "") {
										let Ie = new Date(res.data[0].visit_date);
										res.data[0].visit_date = Ie.toISOString().split("T")[0];
									}

									ce(res); // حفظ البيانات المعروضة
									ue(!1); // تحويل الزر إلى "استعلام جديد"
									ie(!1); // إيقاف التحميل
								})
								.catch(ve => {
									ue(!1); // إيقاف التحميل عند الفشل
									ie(!1);
									re(!0); // تفعيل مؤشر وجود خطأ
								})
							})
						})
					)
			};

		// إعادة إخفاء التنبيهات فور تغيير قيم حقول الإدخال
		reactExports.useEffect(() => {
			se([])
		}, [K, Z]);

		// --- دالة تفريغ الشاشة لبدء استعلام جديد ---
		const he = () => {
			se([]), re(!1), X(""), ee(""), ce(""), ue(!0)
		};

		// ==========================================
		// 4. بناء واجهة المستخدم (JSX Render)
		// ==========================================
		return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, {
			children: jsxRuntimeExports.jsxs("div", {
				className: "inner-page inquiries-container",
				children: [
					// العنوان الفرعي والرئيسي
					jsxRuntimeExports.jsx("h1", { className: "heading", children: "الإجازات المرضية" }),
					jsxRuntimeExports.jsx("p", {
						className: "sub-heading",
						children: "خدمة الاستعلام عن الإجازات المرضية تتيح لك الاستعلام عن حالة طلبك للإجازة ويمكنك طباعتها عن طريق تطبيق صحتي"
					}),

					jsxRuntimeExports.jsxs("div", {
						className: "row justify-content-center mt-1",
						children: [
							jsxRuntimeExports.jsxs("div", {
								className: "col-md-5 p-4",
								children: [
									// عرض أخطاء التحقق الإدخالية (إن وجدت)
									te.map((me, Ee) => jsxRuntimeExports.jsx("p", { className: "alert alert-danger", children: me }, Ee)),

									// حقل مدخل رمز الخدمة
									jsxRuntimeExports.jsx("div", {
										className: "form-group",
										children: jsxRuntimeExports.jsx("input", {
											type: "text",
											onChange: Ae,
											maxLength: "20",
											value: K,
											placeholder: "رمز الخدمة",
											className: "form-control"
										})
									}),

									// حقل مدخل رقم الهوية
									jsxRuntimeExports.jsxs("div", {
										className: "form-group",
										children: [
											jsxRuntimeExports.jsx("label", {}),
											jsxRuntimeExports.jsx("input", {
												onChange: de,
												value: Z,
												type: "text",
												maxLength: "10",
												pattern: "\\d*",
												placeholder: "رقم الهوية / الإقامة",
												className: "form-control"
											})
										]
									}),

									// تنبيه خطأ الشبكة
									ne && jsxRuntimeExports.jsx("div", { className: "alert alert-danger mt-2", children: "خطأ في الاستعلام" }),

									// [عرض بطاقة النتائج إذا وجِدت بيانات]
									oe && (oe.data.length > 0 ? jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, {
										children: jsxRuntimeExports.jsxs("div", {
											className: "results-inquiery row",
											children: [
												// اسم المريض (تم التحديث إلى employee_name)
												jsxRuntimeExports.jsxs("div", { className: "col-md-6", children: [jsxRuntimeExports.jsx("span", { children: "الاسم: " }), oe.data[0].employee_name] }),
												
												// اسم المرافق (تم التحديث إلى companionName)
												oe.data[0].companionName && jsxRuntimeExports.jsxs("div", { className: "col-md-6", children: [jsxRuntimeExports.jsx("span", { children: "اسم المرافق:" }), " ", oe.data[0].companionName] }),

												// تحويل رقم صلة القرابة إلى نص عربي (تم التحديث إلى relationship)
												oe?.data[0].relationship && jsxRuntimeExports.jsxs("div", {
													className: "col-md-6",
													children: [
														jsxRuntimeExports.jsx("span", { children: "صلة القرابة:" }), " ",
														jsxRuntimeExports.jsx("span", {
															style: { fontWeight: "300" },
															children: oe.data[0].relationship === 1 ? "أم" : oe.data[0].relationship === 2 ? "أب" : oe.data[0].relationship === 3 ? "أخ" : oe.data[0].relationship === 4 ? "أخت" : oe.data[0].relationship === 5 ? "ابن" : oe.data[0].relationship === 6 ? "ابنة" : oe.data[0].relationship === 7 ? "زوج" : oe.data[0].relationship === 8 ? "زوجة" : oe.data[0].relationship === 9 ? "جد" : oe.data[0].relationship === 10 ? "جدة" : oe.data[0].relationship === 11 ? "الخال" : oe.data[0].relationship === 12 ? "العم" : oe.data[0].relationship === 13 ? "الخالة" : oe.data[0].relationship === 14 ? "العمة" : oe.data[0].relationship === 15 ? "ابن الأخت" : oe.data[0].relationship === 16 ? "ابن الأخ" : oe.data[0].relationship === 17 ? "ابنة الأخت" : oe.data[0].relationship === 18 ? "ابنة الأخ" : ""
														})
													]
												}),

												// تاريخ الإصدار، والبداية، والنهاية، والمدة (تم التحديث للأسماء الجديدة)
												jsxRuntimeExports.jsxs("div", { className: "col-md-6", children: [jsxRuntimeExports.jsx("span", { children: "تاريخ إصدار تقرير الإجازة:" }), " ", oe.data[0].visit_date] }),
												jsxRuntimeExports.jsxs("div", { className: "col-md-6", children: [jsxRuntimeExports.jsx("span", { children: "تبدأ من:" }), " ", formatDate$1(oe.data[0].start_date)] }),
												jsxRuntimeExports.jsxs("div", { className: "col-md-6", children: [jsxRuntimeExports.jsx("span", { children: "وحتى:" }), " ", formatDate$1(oe.data[0].end_date)] }),
												jsxRuntimeExports.jsxs("div", { className: "col-md-6", children: [jsxRuntimeExports.jsx("span", { children: "المدة بالأيام:" }), " ", oe.data[0].total_days] }),
												
												// بيانات الطبيب المعالج (تم التحديث إلى doctor_name و job_title)
												jsxRuntimeExports.jsxs("div", { className: "col-md-6", children: [jsxRuntimeExports.jsx("span", { children: "اسم الطبيب:" }), " ", oe.data[0].doctor_name] }),
												jsxRuntimeExports.jsxs("div", { className: "col-md-6", children: [jsxRuntimeExports.jsx("span", { children: "المسمى الوظيفي:" }), " ", oe.data[0].job_title] })
											]
										})
									}) : jsxRuntimeExports.jsx("div", { className: "alert alert-danger mt-2", children: "لا يوجد نتائج" })),

									// [أزرار التفاعل (استعلام / استعلام جديد)]
									jsxRuntimeExports.jsxs(h$1, {
										reCaptchaKey: env$v.VITE_APP_RECAPETCHAKEY,
										children: [
											le && jsxRuntimeExports.jsxs("button", {
												onClick: pe,
												disabled: ae,
												className: "btn btn-primary mt-3",
												type: "submit",
												children: [
													"استعلام",
													ae && jsxRuntimeExports.jsx(FontAwesomeIcon, { icon: faSpinner, className: "fa-spin" }) // أيقونة التحميل عند البحث
												]
											}),
											!le && jsxRuntimeExports.jsx("button", {
												onClick: he,
												className: "btn btn-primary mt-3",
												children: "استعلام جديد"
											})
										]
									})
								]
							}),

							// زر الرجوع للقائمة الرئيسية
							jsxRuntimeExports.jsx("div", {
								className: "col-md-12 text-center",
								children: jsxRuntimeExports.jsx(Link, { className: "btn btn-primary mb-3", to: "/inquiries", children: "رجوع للاستعلامات" })
							})
						]
					})
				]
			})
		})
	},
                                                                    
