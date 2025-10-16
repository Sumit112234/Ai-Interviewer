// app/profile/page.js
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, Save, Loader2, ArrowLeft } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [profileData, setProfileData] = useState({
    role: "",
    education: [],
    workExperience: [],
    projects: [],
    skills: [],
    additionalInfo: ""
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/profile")
      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/login")
          return
        }
        throw new Error(data.error)
      }

      setProfileData({
        role: data.user.role || "",
        education: data.user.education || [],
        workExperience: data.user.workExperience || [],
        projects: data.user.projects || [],
        skills: data.user.skills || [],
        additionalInfo: data.user.additionalInfo || ""
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsSaving(true)

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(profileData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile")
      }

      setSuccess("Profile updated successfully!")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  const addEducation = () => {
    setProfileData({
      ...profileData,
      education: [...profileData.education, { degree: "", institution: "", year: "", field: "" }]
    })
  }

  const removeEducation = (index) => {
    setProfileData({
      ...profileData,
      education: profileData.education.filter((_, i) => i !== index)
    })
  }

  const updateEducation = (index, field, value) => {
    const updated = [...profileData.education]
    updated[index][field] = value
    setProfileData({ ...profileData, education: updated })
  }

  const addWorkExperience = () => {
    setProfileData({
      ...profileData,
      workExperience: [...profileData.workExperience, { company: "", position: "", duration: "", description: "" }]
    })
  }

  const removeWorkExperience = (index) => {
    setProfileData({
      ...profileData,
      workExperience: profileData.workExperience.filter((_, i) => i !== index)
    })
  }

  const updateWorkExperience = (index, field, value) => {
    const updated = [...profileData.workExperience]
    updated[index][field] = value
    setProfileData({ ...profileData, workExperience: updated })
  }

  const addProject = () => {
    setProfileData({
      ...profileData,
      projects: [...profileData.projects, { name: "", description: "", technologies: [], link: "" }]
    })
  }

  const removeProject = (index) => {
    setProfileData({
      ...profileData,
      projects: profileData.projects.filter((_, i) => i !== index)
    })
  }

  const updateProject = (index, field, value) => {
    const updated = [...profileData.projects]
    if (field === "technologies") {
      updated[index][field] = value.split(",").map(t => t.trim())
    } else {
      updated[index][field] = value
    }
    setProfileData({ ...profileData, projects: updated })
  }

  const addSkillCategory = () => {
    setProfileData({
      ...profileData,
      skills: [...profileData.skills, { category: "", items: [] }]
    })
  }

  const removeSkillCategory = (index) => {
    setProfileData({
      ...profileData,
      skills: profileData.skills.filter((_, i) => i !== index)
    })
  }

  const updateSkillCategory = (index, field, value) => {
    const updated = [...profileData.skills]
    if (field === "items") {
      updated[index][field] = value.split(",").map(s => s.trim())
    } else {
      updated[index][field] = value
    }
    setProfileData({ ...profileData, skills: updated })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <header className="border-b bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Button variant="ghost" onClick={() => router.push("/")} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h1>
          <div className="w-24"></div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-md">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-4 rounded-md">
              {success}
            </div>
          )}

          {/* Role */}
          <Card>
            <CardHeader>
              <CardTitle>Current Role</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="e.g., Software Engineer, Data Scientist"
                value={profileData.role}
                onChange={(e) => setProfileData({ ...profileData, role: e.target.value })}
              />
            </CardContent>
          </Card>

          {/* Education */}
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Education
                <Button type="button" size="sm" onClick={addEducation}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Education
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profileData.education.map((edu, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <h4 className="font-medium">Education {index + 1}</h4>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeEducation(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label>Degree</Label>
                      <Input
                        placeholder="Bachelor of Science"
                        value={edu.degree}
                        onChange={(e) => updateEducation(index, "degree", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Institution</Label>
                      <Input
                        placeholder="University Name"
                        value={edu.institution}
                        onChange={(e) => updateEducation(index, "institution", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Field of Study</Label>
                      <Input
                        placeholder="Computer Science"
                        value={edu.field}
                        onChange={(e) => updateEducation(index, "field", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Year</Label>
                      <Input
                        placeholder="2020-2024"
                        value={edu.year}
                        onChange={(e) => updateEducation(index, "year", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
              {profileData.education.length === 0 && (
                <p className="text-gray-500 text-center py-4">No education added yet</p>
              )}
            </CardContent>
          </Card>

          {/* Work Experience */}
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Work Experience
                <Button type="button" size="sm" onClick={addWorkExperience}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Experience
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profileData.workExperience.map((exp, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <h4 className="font-medium">Experience {index + 1}</h4>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeWorkExperience(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label>Company</Label>
                      <Input
                        placeholder="Company Name"
                        value={exp.company}
                        onChange={(e) => updateWorkExperience(index, "company", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Position</Label>
                      <Input
                        placeholder="Software Engineer"
                        value={exp.position}
                        onChange={(e) => updateWorkExperience(index, "position", e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Duration</Label>
                    <Input
                      placeholder="Jan 2022 - Present"
                      value={exp.duration}
                      onChange={(e) => updateWorkExperience(index, "duration", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      placeholder="Describe your responsibilities and achievements"
                      value={exp.description}
                      onChange={(e) => updateWorkExperience(index, "description", e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              ))}
              {profileData.workExperience.length === 0 && (
                <p className="text-gray-500 text-center py-4">No work experience added yet</p>
              )}
            </CardContent>
          </Card>

          {/* Projects */}
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Projects
                <Button type="button" size="sm" onClick={addProject}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Project
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profileData.projects.map((project, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <h4 className="font-medium">Project {index + 1}</h4>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeProject(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>
                    <Label>Project Name</Label>
                    <Input
                      placeholder="My Awesome Project"
                      value={project.name}
                      onChange={(e) => updateProject(index, "name", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      placeholder="Describe your project"
                      value={project.description}
                      onChange={(e) => updateProject(index, "description", e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>Technologies (comma-separated)</Label>
                    <Input
                      placeholder="React, Node.js, MongoDB"
                      value={project.technologies?.join(", ") || ""}
                      onChange={(e) => updateProject(index, "technologies", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Project Link</Label>
                    <Input
                      placeholder="https://github.com/username/project"
                      value={project.link}
                      onChange={(e) => updateProject(index, "link", e.target.value)}
                    />
                  </div>
                </div>
              ))}
              {profileData.projects.length === 0 && (
                <p className="text-gray-500 text-center py-4">No projects added yet</p>
              )}
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Skills
                <Button type="button" size="sm" onClick={addSkillCategory}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profileData.skills.map((skill, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <h4 className="font-medium">Category {index + 1}</h4>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeSkillCategory(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>
                    <Label>Category Name</Label>
                    <Input
                      placeholder="e.g., Programming Languages, Frameworks"
                      value={skill.category}
                      onChange={(e) => updateSkillCategory(index, "category", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Skills (comma-separated)</Label>
                    <Input
                      placeholder="JavaScript, Python, Java"
                      value={skill.items?.join(", ") || ""}
                      onChange={(e) => updateSkillCategory(index, "items", e.target.value)}
                    />
                  </div>
                </div>
              ))}
              {profileData.skills.length === 0 && (
                <p className="text-gray-500 text-center py-4">No skills added yet</p>
              )}
            </CardContent>
          </Card>

          {/* Additional Info */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Any additional information you'd like to share (certifications, achievements, interests, etc.)"
                value={profileData.additionalInfo}
                onChange={(e) => setProfileData({ ...profileData, additionalInfo: e.target.value })}
                rows={5}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.push("/")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Profile
                </>
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}