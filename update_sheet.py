import re

with open("src/components/dashboard/create-qr-sheet.tsx", "r") as f:
    content = f.read()

# Add bulkCreateAction to props
content = content.replace(
    "createAction: (formData: FormData) => Promise<void>;",
    "createAction: (formData: FormData) => Promise<void>;\n  bulkCreateAction: (formData: FormData) => Promise<void>;"
)

content = content.replace(
    "export function CreateQrSheet({ createAction, locationZones, menusList, ManageLocationZonesModal, plan }: CreateQrSheetProps) {",
    "export function CreateQrSheet({ createAction, bulkCreateAction, locationZones, menusList, ManageLocationZonesModal, plan }: CreateQrSheetProps) {"
)

# Add activeTab state
state_code = """  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"single" | "bulk">("single");"""
content = content.replace(
    "const [isOpen, setIsOpen] = useState(false);",
    state_code
)

# Replace the form with the new tabs + form structure
form_start_regex = r'<form action=\{\(formData\) => \{[\s\S]*?startTransition\(async \(\) => \{[\s\S]*?await createAction\(formData\);[\s\S]*?setIsOpen\(false\);[\s\S]*?\}\);[\s\S]*?\}\} className="space-y-6 mt-4">'
form_start_match = re.search(form_start_regex, content)
if form_start_match:
    original_form_start = form_start_match.group(0)
    new_form_start = """
          <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
            <button type="button" onClick={() => setActiveTab("single")} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'single' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>Single QR</button>
            <button type="button" onClick={() => setActiveTab("bulk")} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'bulk' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>Bulk Generate</button>
          </div>

          <form action={(formData) => {
            startTransition(async () => {
              if (activeTab === "single") {
                await createAction(formData);
              } else {
                await bulkCreateAction(formData);
              }
              setIsOpen(false);
            });
          }} className="space-y-6 mt-4">
"""
    content = content.replace(original_form_start, new_form_start)

# Add the bulk specific inputs where the label input is
label_code = """            <div className="space-y-2.5">
              <Label htmlFor="label" className="text-slate-700 font-medium">
                {mode === "dine_in" ? "Table Number / Label" : "Label (e.g. Front Window)"}
              </Label>
              <Input 
                id="label" 
                name="label" 
                placeholder="e.g. 12, 204, Booth 4" 
                required 
                className="rounded-xl px-3.5 py-2.5 shadow-sm border-slate-200 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500 h-auto"
              />
            </div>"""

new_inputs_code = """            {activeTab === "single" ? (
              <div className="space-y-2.5">
                <Label htmlFor="label" className="text-slate-700 font-medium">
                  {mode === "dine_in" ? "Table Number / Label" : "Label (e.g. Front Window)"}
                </Label>
                <Input 
                  id="label" 
                  name="label" 
                  placeholder="e.g. 12, 204, Booth 4" 
                  required={activeTab === "single"}
                  className="rounded-xl px-3.5 py-2.5 shadow-sm border-slate-200 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500 h-auto"
                />
              </div>
            ) : (
              <div className="space-y-4 border rounded-xl p-4 bg-slate-50 border-slate-100">
                <div className="space-y-2.5">
                  <Label htmlFor="prefix" className="text-slate-700 font-medium">Label Prefix</Label>
                  <Input 
                    id="prefix" 
                    name="prefix" 
                    placeholder="e.g. Table, Cabana, Booth" 
                    required={activeTab === "bulk"}
                    className="rounded-lg px-3 py-2 bg-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2.5">
                    <Label htmlFor="count" className="text-slate-700 font-medium">How many?</Label>
                    <Input 
                      id="count" 
                      name="count" 
                      type="number"
                      min="1"
                      max="100"
                      placeholder="e.g. 10" 
                      required={activeTab === "bulk"}
                      className="rounded-lg px-3 py-2 bg-white"
                    />
                  </div>
                  <div className="space-y-2.5">
                    <Label htmlFor="start" className="text-slate-700 font-medium">Start Number</Label>
                    <Input 
                      id="start" 
                      name="start" 
                      type="number"
                      min="1"
                      defaultValue="1"
                      required={activeTab === "bulk"}
                      className="rounded-lg px-3 py-2 bg-white"
                    />
                  </div>
                </div>
              </div>
            )}"""

content = content.replace(label_code, new_inputs_code)

# Change button text
button_code = """                  <Plus className="mr-2 h-4 w-4" />
                  Generate QR Code"""
new_button_code = """                  <Plus className="mr-2 h-4 w-4" />
                  {activeTab === "single" ? "Generate QR Code" : "Bulk Generate QR Codes"}"""
content = content.replace(button_code, new_button_code)

with open("src/components/dashboard/create-qr-sheet.tsx", "w") as f:
    f.write(content)

